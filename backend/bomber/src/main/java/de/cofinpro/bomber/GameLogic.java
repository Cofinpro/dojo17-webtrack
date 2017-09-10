package de.cofinpro.bomber;

import de.cofinpro.bomber.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@ApplicationScope
@Component
public class GameLogic {

    private static final int BOMB_TIMEOUT_SECONDS = 3;

    private static final int DEFAULT_BLAST_RADIUS = 2;

    private static final int DEFAULT_BOMB_COUNT = 2;

    private static final int INACTIVITY_TIMEOUT_SECONDS = 20;

    private static final int ROUND_TIME_SECONDS = 120;

    private static final int SUDDEN_DEATH_INTERVAL_MILLIS = 500;

    private static final int SCORE_PLAYER_KILL = 10000;
    private static final int SCORE_STONE_KILL = 1500;
    private static final int SCORE_POWERUP = 3500;
    private static final int SCORE_MOVED = 1;

    private static final float POWERUP_SPAWN_PROB_BOMB = 0.15F;
    private static final float POWERUP_SPAWN_PROB_BLAST = 0.15F;

    private State currentState;

    private final CopyOnWriteArrayList<MapDefinition> mapDefinitions = new CopyOnWriteArrayList<>();

    private final ThreadPoolTaskScheduler scheduler;

    private SimpMessagingTemplate template;

    private int currentRound = 0;

    @Autowired
    public GameLogic(SimpMessagingTemplate template) {
        this.scheduler = new ThreadPoolTaskScheduler();
        this.scheduler.setPoolSize(4);
        this.scheduler.initialize();

        this.template = template;
        try {
            initializeMaps();
            resetState();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void initializeMaps() throws IOException {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
        Resource[] resources = resolver.getResources("classpath*:/maps/*.txt");
        List<MapDefinition> maps = new ArrayList<>();
        for (Resource resource: resources){
            maps.add(readMap(resource));
        }
        mapDefinitions.addAll(maps);
    }

    private MapDefinition readMap(Resource resource) throws IOException {
        System.out.println("Reading map from " + resource.getFilename());
        try (InputStream in = resource.getInputStream(); BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            MapDefinition result = new MapDefinition();
            String header = reader.readLine();
            String[] headers = header.split("x");
            int sizeX = Integer.parseInt(headers[0]);
            int sizeY = Integer.parseInt(headers[1]);
            result.setSizeX(sizeX);
            result.setSizeY(sizeY);
            int curRow = 0;
            for (String line : reader.lines().collect(Collectors.toList())) {
                int curColumn = 0;
                for (char c : line.toCharArray()) {
                    if (c == 'x' || c == 'X') {
                        result.getFixStones().add(new Stone(curColumn, curRow));
                    } else if (c == 'o' || c == 'O' || c == '0') {
                        result.getWeakStones().add(new Stone(curColumn, curRow));
                    } else if (c == 'b' || c == 'B') {
                        result.getBombCountPowerups().add(new BombCountPowerup(curColumn, curRow));
                    } else if (c == 'f' || c == 'F') {
                        result.getBlastRadiusPowerups().add(new BlastRadiusPowerup(curColumn, curRow));
                    } else if (c == 's' || c == 'S') {
                        result.getFoliage().add(new Bush(curColumn, curRow));
                    } else {
                        System.out.println("WARN: Code in map generation not recognized and will be ignored: " + c);
                    }
                    curColumn++;
                }
                curRow++;
            }
            System.out.println("Map definition read: " + result.toString());
            return result;
        }
    }

    private synchronized void resetState() {
        this.currentState = new State();
        MapDefinition definition = mapDefinitions.get(ThreadLocalRandom.current().nextInt(0, mapDefinitions.size()));
        this.currentState.setSizeX(definition.getSizeX());
        this.currentState.setSizeY(definition.getSizeY());
        this.currentState.setFixStones(definition.getFixStones());
        this.currentState.setWeakStones(definition.getWeakStones());
        this.currentState.setBlastRadiusPowerups(definition.getBlastRadiusPowerups());
        this.currentState.setBombCountPowerups(definition.getBombCountPowerups());
        this.currentState.setFoliage(definition.getFoliage());
        this.currentRound++;
        System.out.println("State reset: " + currentState.toString());
        System.out.println("Starting round " + currentRound);

        scheduler.schedule(new TimerTask() {
            @Override
            public void run() {
                startSuddenDeath(currentRound);
            }
        }, new Date(System.currentTimeMillis() + (ROUND_TIME_SECONDS * 1000)));
    }

    private synchronized void startSuddenDeath(int affectedRound) {
        currentState.setSuddenDeath(true);
        placeVerticalFixStones(0,0, affectedRound);
    }

    private synchronized void placeVerticalFixStones(int row, int col, int affectedRound) {
        if (currentRound != affectedRound) {
            // only handle sudden death if no new round has been started
            return;
        }

        this.currentState.getFixStones().add(new Stone(col, row));
        Position deathPos = new Position(col, row);

        Player killedPlayer = null;
        for (Player p: this.currentState.getPlayers()) {
            if (deathPos.equals(p.getPosition())) {
                killedPlayer = p;
                break;
            }
        }
        if (killedPlayer != null) {
            System.out.println("Player killed by sudden death: " + killedPlayer);
            this.currentState.getPlayers().remove(killedPlayer);
            handleKilledPlayerUpgrades(killedPlayer);
        }
        final int mapSizeX = this.currentState.getSizeX();
        final int mapSizeY = this.currentState.getSizeY();
        

        scheduler.schedule(new TimerTask() {
            @Override
            public void run() {
                if (col + 1 < mapSizeX) {
                    placeVerticalFixStones(row, col + 1, affectedRound);
                }
                else if (row + 1 < mapSizeY) {
                    placeVerticalFixStones(row +1, 0, affectedRound);
                }
            }
        }, new Date(System.currentTimeMillis() + (SUDDEN_DEATH_INTERVAL_MILLIS)));
    }

    synchronized State addPlayer(NewPlayer newPlayer) {
        System.out.println("Adding new player: " + newPlayer);
        Player existing;
        if (this.currentState.getPlayers().isEmpty()) {
            resetState();
            existing = null;
        } else {
            existing = this.currentState.getPlayers().stream()
                    .filter(p -> p.getId().equals(newPlayer.getId()))
                    .findFirst()
                    .orElse(null);
        }

        if (existing != null) {
            System.out.println("Hacker tried to log again");
            return null;  // No change
        }

        Position newPosition = randomValidPosition();
        System.out.println("Sending new player to position: " + newPosition);
        Player player = new Player();
        player.setId(newPlayer.getId());
        player.setNickName(newPlayer.getNickName());
        player.setX(newPosition.getX());
        player.setY(newPosition.getY());
        player.setBlastRadius(DEFAULT_BLAST_RADIUS);
        player.setBombCount(DEFAULT_BOMB_COUNT);
        this.currentState.getPlayers().add(player);

        // TODO Start a timer to kill player for inactivity

        this.currentState.setServerTime(System.currentTimeMillis());
        return this.currentState;
    }

    synchronized State movePlayer(Movement movement) {
        // TODO Reset player timer

        System.out.println("Moving player: " + movement);
        Player player = this.currentState.getPlayers().stream()
                .filter(p -> p.getId().equals(movement.getPlayerId()))
                .findFirst()
                .orElse(null);

        if (player == null) {
            System.out.println("Tried to move unexisting player");
            return null;
        }

        Position newPosition;
        if (Character.toLowerCase(movement.getDirection()) == 'u') {
            newPosition = new Position(player.getX(), player.getY() - 1);
        } else if (Character.toLowerCase(movement.getDirection()) == 'd') {
            newPosition = new Position(player.getX(), player.getY() + 1);
        } else if (Character.toLowerCase(movement.getDirection()) == 'l') {
            newPosition = new Position(player.getX() - 1, player.getY());
        } else if (Character.toLowerCase(movement.getDirection()) == 'r') {
            newPosition = new Position(player.getX() + 1, player.getY());
        } else {
            System.out.println("Wrong direction sent");
            return null;
        }

        if (newPosition.getX() < 0 || newPosition.getX() >= this.currentState.getSizeX()
                || newPosition.getY() < 0 || newPosition.getY() >= this.currentState.getSizeY()) {
            System.out.println("Tried to move out of the field");
            return null;
        }

        Stream<Position> fixedStream = this.currentState.getFixStones().stream().map(Stone::getPosition);
        Stream<Position> weakStream = this.currentState.getWeakStones().stream().map(Stone::getPosition);
        Stream<Position> bombStream = this.currentState.getBombs().stream().map(Bomb::getPosition);
        Stream<Position> playerStream = this.currentState.getPlayers().stream().map(Player::getPosition);
        if (Stream.concat(Stream.concat(Stream.concat(fixedStream, weakStream), bombStream), playerStream)
                .anyMatch(p -> p.equals(newPosition))) {
            System.out.println("Collision - invalid position");
            return null;
        }

        Stream<Position> blastPowerupStream = this.currentState.getBlastRadiusPowerups().stream().map(BlastRadiusPowerup::getPosition);
        if (blastPowerupStream.anyMatch(p -> p.equals(newPosition))) {
            System.out.println("Collected blast radius upgrade: " + player);
            player.increaseBlastRadius();
            this.currentState.removeBlastRadiusPowerup(newPosition);
            player.setScore(player.getScore() + SCORE_POWERUP);
        }

        Stream<Position> bombPowerupStream = this.currentState.getBombCountPowerups().stream().map(BombCountPowerup::getPosition);
        if (bombPowerupStream.anyMatch(p -> p.equals(newPosition))) {
            System.out.println("Collected bomb count upgrade: " + player);
            player.increaseBombCount();
            this.currentState.removeBombCountPowerup(newPosition);
            player.setScore(player.getScore() + SCORE_POWERUP);
        }

        player.setX(newPosition.getX());
        player.setY(newPosition.getY());
        player.setScore(player.getScore() + SCORE_MOVED);

        return this.currentState;
    }

    synchronized State addBomb(NewBomb newBomb) {
        // TODO Reset timer for player

        System.out.println("Adding a bomb: " + newBomb);
        this.currentState.setExploded(null);

        Player player = this.currentState.getPlayers().stream()
                .filter(p -> p.getId().equals(newBomb.getPlayerId()))
                .findFirst()
                .orElse(null);

        if (player == null) {
            System.out.println("Tried to add a bomb for invalid user");
            return null;
        }

        // Check if the user already has too many bombs
        int bombs = (int)this.currentState.getBombs().stream()
                .filter(b -> b.getUserId().equals(newBomb.getPlayerId()))
                .count();

        if (bombs >= player.getBombCount()) {
            System.out.println("Player has too many bombs, cant add new");
            return null;
        }

        final String bombId = UUID.randomUUID().toString();

        Bomb bomb = new Bomb();
        bomb.setId(bombId);
        bomb.setUserId(player.getId());
        bomb.setBlastRadius(player.getBlastRadius());
        bomb.setX(player.getX());
        bomb.setY(player.getY());
        bomb.setDetonateAt(System.currentTimeMillis() + (BOMB_TIMEOUT_SECONDS * 1000));

        this.currentState.getBombs().add(bomb);

        scheduler.schedule(new TimerTask() {
            @Override
            public void run() {
                explodeBomb(bombId);
            }
        }, new Date(System.currentTimeMillis() + (BOMB_TIMEOUT_SECONDS * 1000)));

        this.currentState.setServerTime(System.currentTimeMillis());
        return this.currentState;
    }

    private synchronized void explodeBomb(String bombId) {
        this.currentState.setExploded(null);

        Bomb explodedBomb = getExplodedBomb(bombId);
        if (explodedBomb == null) {
            return;
        }

        System.out.println("Root bomb detonation: " + explodedBomb);

        Player bombOwner = this.currentState.getPlayers().stream()
                .filter(p -> p.getId().equals(explodedBomb.getUserId()))
                .findFirst()
                .orElse(null);

        // Build maps for all objects, to find them easily by position
        MapObjects objects = new MapObjects(this.currentState);

        // Recursively blow bombs, determining all positions exploded
        Set<Position> blownPositions = new HashSet<>();
        recursiveExplodeBomb(explodedBomb, objects, blownPositions);
        this.currentState.setExploded(blownPositions);

        // remove exploded players and stones
        objects.getPlayers().entrySet().stream()
                .filter(e -> blownPositions.contains(e.getKey()))
                .flatMap(e -> e.getValue().stream())
                .forEach(p -> {
                    System.out.println("PLAYER KILLED: " + p);
                    if (bombOwner != null && !p.getId().equals(bombOwner.getId())) {
                        bombOwner.setScore(bombOwner.getScore() + SCORE_PLAYER_KILL);
                    }
                    this.currentState.getPlayers().remove(p);

                    handleKilledPlayerUpgrades(p);
                });
        objects.getWeakStones().entrySet().stream()
                .filter(e -> blownPositions.contains(e.getKey()))
                .forEach(e -> {
                    System.out.println("Blew weak stone: " + e.getValue());
                    if (bombOwner != null) {
                        bombOwner.setScore(bombOwner.getScore() + SCORE_STONE_KILL);
                    }
                    this.currentState.getWeakStones().remove(e.getValue());

                    handlePowerupSpawn(e.getValue().getPosition());
                });

        this.currentState.setServerTime(System.currentTimeMillis());

        this.template.convertAndSend("/topic/state", this.currentState);
    }

    private void handlePowerupSpawn(Position position) {
        float rand = ThreadLocalRandom.current().nextFloat();

        if (rand < POWERUP_SPAWN_PROB_BOMB) {
            currentState.addBombCountPowerup(position);
        } 
        else if (rand < POWERUP_SPAWN_PROB_BOMB + POWERUP_SPAWN_PROB_BLAST) {
            currentState.addBlastRadiusPowerup(position);
        }
    }

    private void handleKilledPlayerUpgrades(Player p) {
        for (int i = DEFAULT_BLAST_RADIUS; i < p.getBlastRadius(); i++) {
            currentState.addBlastRadiusPowerup(randomValidPosition());
        }
        for (int i = DEFAULT_BOMB_COUNT; i < p.getBombCount(); i++) {
            currentState.addBombCountPowerup(randomValidPosition());
        }
    }

    private Bomb getExplodedBomb(String bombId) {
        return this.currentState.getBombs().stream()
                .filter(b -> b.getId().equals(bombId))
                .findFirst()
                .orElse(null);
    }

    private void recursiveExplodeBomb(Bomb explodedBomb, MapObjects objects, Set<Position> blownPositions) {
        // remove bomb from state and map
        boolean found = this.currentState.getBombs().remove(explodedBomb);
        if (!found) {
            return;   // Already removed in another iteration
        }
        System.out.println("Bomb detonated: " + explodedBomb);
        objects.getBombs().remove(explodedBomb.getPosition());  // may remove more than one: they both exploded, makes no difference

        // determine exploded positions
        addBlownPositions(explodedBomb, objects, blownPositions);

        // Explode next bombs - weak stones will still stop them (objects map not changed)
        // Don't stream them - the recursive function may change things
        Set<Bomb> toExplode = objects.getBombs().entrySet().stream()
                .filter(e -> blownPositions.contains(e.getKey()))
                .flatMap(e -> e.getValue().stream())
                .collect(Collectors.toCollection(HashSet::new));
        for (Bomb exploding : toExplode) {
            recursiveExplodeBomb(exploding, objects, blownPositions);
        }
    }

    private void addBlownPositions(Bomb explodedBomb, MapObjects objects, Set<Position> result) {
        // Add the bomb's position
        result.add(explodedBomb.getPosition());

        // Process UP
        int curX = explodedBomb.getX();
        int curY = explodedBomb.getY();
        for (int i = 0; i < explodedBomb.getBlastRadius(); i++) {
            curY--;
            if (curY < 0) {
                break;
            }
            Position pos = new Position(curX, curY);
            if (objects.getFixStones().containsKey(pos)) {
                break;  // found a fixed one, stop
            }
            result.add(pos);  // this will explode
            if (objects.getWeakStones().containsKey(pos)) {
                break;  // this explodes, but stops it here (don't go further)
            }
        }

        // Process DOWN
        curX = explodedBomb.getX();
        curY = explodedBomb.getY();
        for (int i = 0; i < explodedBomb.getBlastRadius(); i++) {
            curY++;
            if (curY >= this.currentState.getSizeY()) {
                break;
            }
            Position pos = new Position(curX, curY);
            if (objects.getFixStones().containsKey(pos)) {
                break;  // found a fixed one, stop
            }
            result.add(pos);  // this will explode
            if (objects.getWeakStones().containsKey(pos)) {
                break;  // this explodes, but stops it here (don't go further)
            }
        }

        // Process LEFT
        curX = explodedBomb.getX();
        curY = explodedBomb.getY();
        for (int i = 0; i < explodedBomb.getBlastRadius(); i++) {
            curX--;
            if (curX < 0) {
                break;
            }
            Position pos = new Position(curX, curY);
            if (objects.getFixStones().containsKey(pos)) {
                break;  // found a fixed one, stop
            }
            result.add(pos);  // this will explode
            if (objects.getWeakStones().containsKey(pos)) {
                break;  // this explodes, but stops it here (don't go further)
            }
        }

        // Process RIGHT
        curX = explodedBomb.getX();
        curY = explodedBomb.getY();
        for (int i = 0; i < explodedBomb.getBlastRadius(); i++) {
            curX++;
            if (curX >= this.currentState.getSizeX()) {
                break;
            }
            Position pos = new Position(curX, curY);
            if (objects.getFixStones().containsKey(pos)) {
                break;  // found a fixed one, stop
            }
            result.add(pos);  // this will explode
            if (objects.getWeakStones().containsKey(pos)) {
                break;  // this explodes, but stops it here (don't go further)
            }
        }
    }

    private Position randomValidPosition() {
        MapObjects objects = new MapObjects(this.currentState);

        Position result;
        boolean invalid;
        do {
            result = new Position(
                    ThreadLocalRandom.current().nextInt(0, this.currentState.getSizeX()),
                    ThreadLocalRandom.current().nextInt(0, this.currentState.getSizeY()));

            invalid = !isPositionValid(result, objects);
        } while (invalid);

        return result;
    }

    private boolean isPositionValid(Position position, MapObjects objects) {
        return !(objects.getWeakStones().containsKey(position)
                || objects.getFixStones().containsKey(position)
                || objects.getBombs().containsKey(position)
                || objects.getPlayers().containsKey(position));
    }

}
