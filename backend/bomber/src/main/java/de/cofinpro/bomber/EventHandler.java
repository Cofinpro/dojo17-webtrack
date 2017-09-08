package de.cofinpro.bomber;

import de.cofinpro.bomber.models.Bomb;
import de.cofinpro.bomber.models.Player;
import de.cofinpro.bomber.models.State;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class EventHandler {

    @MessageMapping("/player")
    @SendTo("/topic/state")
    public State playerUpdate(Player player) throws Exception {
        // TODO Calculate new state
        State state = new State();
        return state;
    }

    @MessageMapping("/bomb")
    @SendTo("/topic/state")
    public State newBomb(Bomb bomb) throws Exception {
        // TODO Make asynchron bomb explosion event
        // TODO Calculate new state
        State state = new State();
        return state;
    }

}
