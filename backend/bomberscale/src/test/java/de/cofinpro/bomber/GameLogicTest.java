package de.cofinpro.bomber;


import de.cofinpro.bomber.models.Player;
import de.cofinpro.bomber.models.State;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

public class GameLogicTest {

    @Test
    public void testMapCreation() {
        GameLogic gameLogic = new GameLogic(Mockito.mock(SimpMessagingTemplate.class));

        Player player = new Player();
        player.setId(UUID.randomUUID().toString());
        player.setNickName("ME");

        State state = gameLogic.addOrMovePlayer(player);

        System.out.println("Determined state:");
        System.out.println(state);



    }


}
