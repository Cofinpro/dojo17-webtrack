package de.cofinpro.bomber;

import de.cofinpro.bomber.models.*;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class MapObjects {

    private final Map<Position, Player> players;
    private final Map<Position, Bomb> bombs;
    private final Map<Position, Stone> fixStones;
    private final Map<Position, Stone> weakStones;

    public MapObjects(State state) {
        players = state.getPlayers().stream().collect(Collectors.toMap(Player::getPosition, Function.identity()));
        bombs = state.getBombs().stream().collect(Collectors.toMap(Bomb::getPosition, Function.identity()));
        fixStones = state.getFixStones().stream().collect(Collectors.toMap(Stone::getPosition, Function.identity()));
        weakStones = state.getWeakStones().stream().collect(Collectors.toMap(Stone::getPosition, Function.identity()));
    }

    public Map<Position, Player> getPlayers() {
        return players;
    }

    public Map<Position, Bomb> getBombs() {
        return bombs;
    }

    public Map<Position, Stone> getFixStones() {
        return fixStones;
    }

    public Map<Position, Stone> getWeakStones() {
        return weakStones;
    }

}
