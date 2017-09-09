package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Movement;
import de.cofinpro.bomber.models.NewPlayer;
import de.cofinpro.bomber.models.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class EventHandler {

    private final GameLogic gameLogic;

    @Autowired
    public EventHandler(GameLogic gameLogic) {
        this.gameLogic = gameLogic;
    }

    @MessageMapping("/register")
    @SendTo("/topic/state")
    public State register(NewPlayer newPlayer) throws Exception {
        return gameLogic.addPlayer(newPlayer);
    }

    @MessageMapping("/move")
    @SendTo("/topic/state")
    public State movePlayer(Movement movement) throws Exception {
        return gameLogic.movePlayer(movement);
    }

    @MessageMapping("/bomb")
    @SendTo("/topic/state")
    public State newBomb(String playerId) throws Exception {
        return gameLogic.addBomb(playerId);
    }

}
