package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Bomb;
import de.cofinpro.bomber.models.Player;
import de.cofinpro.bomber.models.State;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScope
@Component
public class GameLogic {

    private State currentState;
    private final int bombTimeout = 10 * 1000;

    public GameLogic() {
        this.currentState = new State();
    }

    public GameLogic(State state) {
        if (state == null) {
            state = new State();
        }

        this.currentState = state;
    }

    public synchronized State addOrMovePlayer(Player player) {
        this.currentState.getPlayers().stream()
                .filter(p -> p.getId().equals(player.getId()))
                .findFirst()
                .ifPresent(p -> this.currentState.getPlayers().remove(p));

        this.currentState.getPlayers().add(player);

        return this.currentState;
    }

    public synchronized State addBomb(Bomb bomb) {
        bomb.setId(UUID.randomUUID().toString());
        this.currentState.getBombs().add(bomb);

        final String bombId = bomb.getId();
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                explodeBomb(bombId);
            }
        }, bombTimeout, 0);

        return this.currentState;
    }

    public synchronized State explodeBomb(String bombId) {
        Bomb explodedBomb = getExplodedBomb(bombId);
        this.currentState.getBombs().remove(explodedBomb);
        this.currentState.setPlayers(killPlayers(explodedBomb));

        return this.currentState;
    }

    private List<Player> killPlayers(Bomb bomb) {
        return this.currentState.getPlayers().stream()
                .filter(p -> p.getX() == bomb.getX() && p.getY() == bomb.getY())
                .collect(Collectors.toList());
    }

    private Bomb getExplodedBomb(String bombId) {
        return this.currentState.getBombs().stream()
                .filter(b -> b.getId().equals(bombId))
                .findFirst()
                .get();
    }
}
