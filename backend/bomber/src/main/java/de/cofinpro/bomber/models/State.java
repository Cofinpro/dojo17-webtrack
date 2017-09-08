package de.cofinpro.bomber.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class State {

    private List<Player> players = new ArrayList<>();
    private List<Bomb> bombs = new ArrayList<>();
    private Date serverTime;

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public List<Bomb> getBombs() {
        return bombs;
    }

    public void setBombs(List<Bomb> bombs) {
        this.bombs = bombs;
    }

    public Date getServerTime() {
        return serverTime;
    }

    public void setServerTime(Date serverTime) {
        this.serverTime = serverTime;
    }
}
