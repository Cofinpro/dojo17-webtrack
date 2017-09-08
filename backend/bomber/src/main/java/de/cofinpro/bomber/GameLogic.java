package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Bomb;
import de.cofinpro.bomber.models.Player;
import de.cofinpro.bomber.models.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import java.util.List;
import java.util.TimerTask;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScope
@Component
public class GameLogic {

    private static final int BOMB_TIMEOUT = 10 * 1000;

    private State currentState;

    private final TaskScheduler scheduler = new ThreadPoolTaskScheduler();

    @Autowired
    private SimpMessagingTemplate template;

    public GameLogic() {
        this.currentState = new State();
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

        scheduler.scheduleWithFixedDelay(new TimerTask() {
            @Override
            public void run() {
                explodeBomb(bombId);
            }
        }, BOMB_TIMEOUT);

        return this.currentState;
    }

    private synchronized void explodeBomb(String bombId) {
        Bomb explodedBomb = getExplodedBomb(bombId);
        if (explodedBomb == null) {
            return;
        }
        this.currentState.getBombs().remove(explodedBomb);
        this.currentState.setPlayers(killPlayers(explodedBomb));

        this.template.convertAndSend("/topic/state", this.currentState);
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
                .orElse(null);
    }

}