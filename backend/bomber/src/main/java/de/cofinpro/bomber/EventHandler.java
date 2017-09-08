package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Bomb;
import de.cofinpro.bomber.models.Player;
import de.cofinpro.bomber.models.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class EventHandler {

    @Autowired
    private GameLogic gameLogic;

    @MessageMapping("/player")
    @SendTo("/topic/state")
    public State playerUpdate(Player player) throws Exception {
        return gameLogic.addOrMovePlayer(player);
    }

    @MessageMapping("/bomb")
    @SendTo("/topic/state")
    public State newBomb(Bomb bomb) throws Exception {
        return gameLogic.addBomb(bomb);
    }

}
