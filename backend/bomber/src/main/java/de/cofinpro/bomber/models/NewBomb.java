package de.cofinpro.bomber.models;

public class NewBomb {

    private String playerId;

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    @Override
    public String toString() {
        return "NewBomb{" +
                "playerId='" + playerId + '\'' +
                '}';
    }
}
