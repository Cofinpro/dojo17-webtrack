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

import java.time.LocalDateTime;
import java.util.List;
import java.util.TimerTask;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScope
@Component
public class GameLogic {

    private static final int BOMB_TIMEOUT_SECONDS = 10;

    private static final int BOMB_RADIUS = 1;

    private State currentState;

    private final TaskScheduler scheduler = new ThreadPoolTaskScheduler();

    @Autowired
    private SimpMessagingTemplate template;

    public GameLogic() {
        this.currentState = new State();
    }

    synchronized State addOrMovePlayer(Player player) {
        this.currentState.getPlayers().stream()
                .filter(p -> p.getId().equals(player.getId()))
                .findFirst()
                .ifPresent(p -> this.currentState.getPlayers().remove(p));

        this.currentState.getPlayers().add(player);

        this.currentState.setServerTime(LocalDateTime.now());
        return this.currentState;
    }

    synchronized State addBomb(Bomb bomb) {
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
        Bomb explodedBomb = getExplodedBomb(bombId);
        if (explodedBomb == null) {
            return;
        }

        this.currentState.getBombs().remove(explodedBomb);
        this.currentState.setPlayers(killPlayers(explodedBomb));

        this.currentState.setServerTime(LocalDateTime.now());

        this.template.convertAndSend("/topic/state", this.currentState);
    }

    private List<Player> killPlayers(Bomb bomb) {
        return this.currentState.getPlayers().stream()
                .filter(p -> !isPlayerInBombRadius(p, bomb))
                .collect(Collectors.toList());
    }

    private boolean isPlayerInBombRadius(Player player, Bomb bomb) {
        return (player.getX() == bomb.getX()
                && player.getY() >= bomb.getY() - BOMB_RADIUS
                && player.getY() <= bomb.getY() + BOMB_RADIUS)
                || (player.getY() == bomb.getY()
                && player.getX() >= bomb.getX() - BOMB_RADIUS
                && player.getX() <= bomb.getX() + BOMB_RADIUS);
    }

    private Bomb getExplodedBomb(String bombId) {
        return this.currentState.getBombs().stream()
                .filter(b -> b.getId().equals(bombId))
                .findFirst()
                .orElse(null);
    }

}
