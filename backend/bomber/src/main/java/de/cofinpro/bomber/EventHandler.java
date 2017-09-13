package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Movement;
import de.cofinpro.bomber.models.NewBomb;
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
    //@SendTo("/topic/battlefield")
    public void register(NewPlayer newPlayer) throws Exception {
        gameLogic.addPlayer(newPlayer);
    }

    @MessageMapping("/move")
    @SendTo("/topic/state")
    public State movePlayer(Movement movement) throws Exception {
        return gameLogic.movePlayer(movement);
    }

    @MessageMapping("/bomb")
    @SendTo("/topic/state")
    public State newBomb(NewBomb bomb) throws Exception {
        return gameLogic.addBomb(bomb);
    }

}
