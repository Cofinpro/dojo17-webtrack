package de.cofinpro.bomber.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class State {

    private int sizeX;
    private int sizeY;
    private List<Player> players = new ArrayList<>();
    private List<Bomb> bombs = new ArrayList<>();
    private List<Stone> fixStones = new ArrayList<>();
    private List<Stone> weakStones = new ArrayList<>();
    private List<Position> exploded = new ArrayList<>();
    private Long serverTime;

    public int getSizeX() {
        return sizeX;
    }

    public void setSizeX(int sizeX) {
        this.sizeX = sizeX;
    }

    public int getSizeY() {
        return sizeY;
    }

    public void setSizeY(int sizeY) {
        this.sizeY = sizeY;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players.clear();
        if (players != null) {
            this.players.addAll(players);
        }
    }

    public List<Bomb> getBombs() {
        return bombs;
    }

    public void setBombs(List<Bomb> bombs) {
        this.bombs.clear();
        if (bombs != null) {
            this.bombs.addAll(bombs);
        }
    }

    public List<Stone> getFixStones() {
        return fixStones;
    }

    public void setFixStones(List<Stone> fixStones) {
        this.fixStones.clear();
        if (fixStones != null) {
            this.fixStones.addAll(fixStones);
        }
    }

    public List<Stone> getWeakStones() {
        return weakStones;
    }

    public void setWeakStones(List<Stone> weakStones) {
        this.weakStones.clear();
        if (weakStones != null) {
            this.weakStones.addAll(weakStones);
        }
    }

    public List<Position> getExploded() {
        return exploded;
    }

    public void setExploded(Collection<Position> exploded) {
        this.exploded.clear();
        if (exploded != null) {
            this.exploded.addAll(exploded);
        }
    }

    public Long getServerTime() {
        return serverTime;
    }

    public void setServerTime(Long serverTime) {
        this.serverTime = serverTime;
    }

    @Override
    public String toString() {
        return "State{" +
                "sizeX=" + sizeX +
                ", sizeY=" + sizeY +
                ", players=" + players +
                ", bombs=" + bombs +
                ", fixStones=" + fixStones +
                ", weakStones=" + weakStones +
                ", exploded=" + exploded +
                ", serverTime=" + serverTime +
                '}';
    }
}
