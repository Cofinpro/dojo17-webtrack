package de.cofinpro.bomber;

import de.cofinpro.bomber.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;

@ApplicationScope
@Component
public class GameLogic {

    private static final int BOMB_TIMEOUT_SECONDS = 10;

    private static final int BOMB_RADIUS = 4;

    private State currentState;

    private final CopyOnWriteArrayList<MapDefinition> mapDefinitions = new CopyOnWriteArrayList<>();

    private final TaskScheduler scheduler = new ThreadPoolTaskScheduler();

    private SimpMessagingTemplate template;

    @Autowired
    public GameLogic(SimpMessagingTemplate template) {
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
        Resource[] resources = resolver.getResources("classpath*:/*.txt");
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
            reader.lines().forEach(line -> {
                int curColumn = 0;
                line.chars().forEach(i -> {
                    if (i == (int)'x' || i == (int)'X') {
                        result.getFixStones().add(new Stone(curColumn, curRow));
                    } else if (i == (int)'o' || i == (int)'O' || i == (int)'0') {
                        result.getWeakStones().add(new Stone(curColumn, curRow));
                    }
                });
            });
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

    synchronized State addOrMovePlayer(Player player) {
        this.currentState.setExploded(null);

        Player existing;
        if (this.currentState.getPlayers().isEmpty()) {
            resetState();
            existing = null;
        } else {
            existing = this.currentState.getPlayers().stream()
                    .filter(p -> p.getId().equals(player.getId()))
                    .findFirst()
                    .orElse(null);
        }

        if (existing != null) {
            existing.setX(player.getX());
            existing.setY(player.getY());
        } else {
            Position newPosition = randomValidPosition();
            player.setX(newPosition.getX());
            player.setY(newPosition.getY());
            this.currentState.getPlayers().add(player);
        }

        this.currentState.setServerTime(LocalDateTime.now());
        return this.currentState;
    }

    synchronized State addBomb(Bomb bomb) {
        this.currentState.setExploded(null);

        final String bombId = UUID.randomUUID().toString();

        bomb.setId(bombId);
        bomb.setDetonateAt(LocalDateTime.now().plusSeconds(BOMB_TIMEOUT_SECONDS));

        this.currentState.getBombs().add(bomb);

        scheduler.scheduleWithFixedDelay(new TimerTask() {
            @Override
            public void run() {
                explodeBomb(bombId);
            }
        }, BOMB_TIMEOUT_SECONDS * 1000);

        this.currentState.setServerTime(LocalDateTime.now());
        return this.currentState;
    }

    private synchronized void explodeBomb(String bombId) {
        this.currentState.setExploded(null);

        Bomb explodedBomb = getExplodedBomb(bombId);
        if (explodedBomb == null) {
            return;
        }

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

        this.currentState.setServerTime(LocalDateTime.now());

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
        this.currentState.getBombs().remove(explodedBomb);
        objects.getBombs().remove(explodedBomb.getPosition());  // may remove more than one: they both exploded, makes no difference

        // determine exploded positions
        addBlownPositions(explodedBomb, objects, blownPositions);

        // Explode next bombs - weak stones will still stop them (objects map not changed)
        objects.getBombs().entrySet().stream()
                .filter(e -> blownPositions.contains(e.getKey()))
                .flatMap(e -> e.getValue().stream())
                .forEach(b -> recursiveExplodeBomb(b, objects, blownPositions));
    }

    private void addBlownPositions(Bomb explodedBomb, MapObjects objects, Set<Position> result) {
        // Process UP
        int curX = explodedBomb.getX();
        int curY = explodedBomb.getY();
        for (int i = 0; i < BOMB_RADIUS; i++) {
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
        for (int i = 0; i < BOMB_RADIUS; i++) {
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
        for (int i = 0; i < BOMB_RADIUS; i++) {
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
        for (int i = 0; i < BOMB_RADIUS; i++) {
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

}
