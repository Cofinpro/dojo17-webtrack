package de.cofinpro.bomber;

import de.cofinpro.bomber.models.*;
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

    @MessageMapping("/player")
    @SendTo("/topic/state")
    public State playerUpdate(Player player) throws Exception {
        return gameLogic.addOrMovePlayer(player);
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
