package de.cofinpro.bomber;

import de.cofinpro.bomber.models.*;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class MapObjects {

    private final Map<Position, List<Player>> players;
    private final Map<Position, List<Bomb>> bombs;
    private final Map<Position, Stone> fixStones;
    private final Map<Position, Stone> weakStones;

    public MapObjects(State state, BattleField battleField) {
        players = state.getPlayers().stream().collect(Collectors.groupingBy(Player::getPosition));
        bombs = state.getBombs().stream().collect(Collectors.groupingBy(Bomb::getPosition));
        fixStones = battleField.getFixStones().stream().collect(Collectors.toMap(Stone::getPosition, Function.identity()));
        weakStones = state.getWeakStones().stream().collect(Collectors.toMap(Stone::getPosition, Function.identity()));
    }

    public Map<Position, List<Player>> getPlayers() {
        return players;
    }

    public Map<Position, List<Bomb>> getBombs() {
        return bombs;
    }

    public Map<Position, Stone> getFixStones() {
        return fixStones;
    }

    public Map<Position, Stone> getWeakStones() {
        return weakStones;
    }

}
