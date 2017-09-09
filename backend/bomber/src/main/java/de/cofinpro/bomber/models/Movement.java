package de.cofinpro.bomber.models;

public class Movement {

    private String playerId;

    private char direction;

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public char getDirection() {
        return direction;
    }

    public void setDirection(char direction) {
        this.direction = direction;
    }

    @Override
    public String toString() {
        return "Movement{" +
                "playerId='" + playerId + '\'' +
                ", direction=" + direction +
                '}';
    }
}
