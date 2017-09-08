package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Bomb;
import de.cofinpro.bomber.models.Player;
import de.cofinpro.bomber.models.State;

import java.util.List;
import java.util.stream.Collectors;

public class GameLogic {

    private State currentState;

    public GameLogic() {
        this.currentState = new State();
    }

    public GameLogic(State state) {
        if (state == null) {
            state = new State();
        }

        this.currentState = state;
    }

    public State evaluateState() {

        this.currentState.setPlayers(killPlayers());
        this.currentState.setBombs(removeDetonatedBombs());

        return this.currentState;
    }

    private List<Player> killPlayers() {
        return this.currentState.getPlayers().stream()
                .filter(p -> p.getX() == 0 && p.getY() == 0)
                .collect(Collectors.toList());
    }

    private List<Bomb> removeDetonatedBombs() {
        return this.currentState.getBombs().stream()
                .filter(b -> b.getDetonateAt().before(this.currentState.getServerTime()))
                .collect(Collectors.toList());
    }

}
