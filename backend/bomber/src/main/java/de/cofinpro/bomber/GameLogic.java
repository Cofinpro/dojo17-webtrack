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

    private State currentState;

    private final CopyOnWriteArrayList<MapDefinition> mapDefinitions = new CopyOnWriteArrayList<>();

    private final ThreadPoolTaskScheduler scheduler;

    private SimpMessagingTemplate template;

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
        System.out.println("State reset: " + currentState.toString());
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
        if (Stream.concat(fixedStream, weakStream).anyMatch(p -> p.equals(newPosition))) {
            System.out.println("Collision - invalid position");
            return null;
        }

        player.setX(newPosition.getX());
        player.setY(newPosition.getY());

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

        System.out.println("Bomb detonated: " + explodedBomb);

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
                .forEach(p -> this.currentState.getPlayers().remove(p));
        objects.getWeakStones().entrySet().stream()
                .filter(e -> blownPositions.contains(e.getKey()))
                .forEach(e -> this.currentState.getWeakStones().remove(e.getValue()));

        this.currentState.setServerTime(System.currentTimeMillis());

        this.template.convertAndSend("/topic/state", this.currentState);
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

            invalid = objects.getWeakStones().containsKey(result) || objects.getFixStones().containsKey(result);
        } while (invalid);

        return result;
    }

    /*
    private void startTimerForUser(final String userId) {
        scheduler.scheduleWithFixedDelay(new TimerTask() {
            @Override
            public void run() {
                explodeBomb(bombId);
            }
        }, BOMB_TIMEOUT_SECONDS * 1000);

    }
    */

}
