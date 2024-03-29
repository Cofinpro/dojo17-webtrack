package de.cofinpro.bomber.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class State {

    private int sizeX;
    private int sizeY;
    private List<Player> players = new ArrayList<>();
    private List<Bomb> bombs = new ArrayList<>();
    private List<Stone> weakStones = new ArrayList<>();
    private List<Position> exploded = new ArrayList<>();
    private List<BombCountPowerup> bombCountPowerups = new ArrayList<>();
    private List<BlastRadiusPowerup> blastRadiusPowerups = new ArrayList<>();
    private Long serverTime;
    private boolean suddenDeath = false;

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

    public List<Stone> getWeakStones() {
        return weakStones;
    }

    public void setWeakStones(List<Stone> weakStones) {
        this.weakStones.clear();
        if (weakStones != null) {
            this.weakStones.addAll(weakStones);
        }
    }

    public List<BombCountPowerup> getBombCountPowerups() {
        return bombCountPowerups;
    }

    public void setBombCountPowerups(List<BombCountPowerup> bombCountPowerups) {
        this.bombCountPowerups.clear();
        if (bombCountPowerups != null) {
            this.bombCountPowerups.addAll(bombCountPowerups);
        }
    }

    public List<BlastRadiusPowerup> getBlastRadiusPowerups() {
        return blastRadiusPowerups;
    }

    public void setBlastRadiusPowerups(List<BlastRadiusPowerup> blastRadiusPowerups) {
        this.blastRadiusPowerups.clear();
        if (blastRadiusPowerups != null) {
            this.blastRadiusPowerups.addAll(blastRadiusPowerups);
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

    public void removeBombCountPowerup(Position position) {
        BombCountPowerup found = null;
        for (BombCountPowerup powerup: bombCountPowerups) {
            if (powerup.getPosition().equals(position)) {
                found = powerup;
            }
        }
        bombCountPowerups.remove(found);
    }

    public void removeBlastRadiusPowerup(Position position) {
        BlastRadiusPowerup found = null;
        for (BlastRadiusPowerup powerup: blastRadiusPowerups) {
            if (powerup.getPosition().equals(position)) {
                found = powerup;
            }
        }
        blastRadiusPowerups.remove(found);
    }

    public void addBlastRadiusPowerup(Position position) {
        blastRadiusPowerups.add(new BlastRadiusPowerup(position.getX(), position.getY()));
    }

    public void addBombCountPowerup(Position position) {
        bombCountPowerups.add(new BombCountPowerup(position.getX(), position.getY()));
    }

    public boolean isSuddenDeath() {
        return suddenDeath;
    }

    public void setSuddenDeath(boolean suddenDeath) {
        this.suddenDeath = suddenDeath;
    }

    @Override
    public String toString() {
        return "State{" +
                "sizeX=" + sizeX +
                ", sizeY=" + sizeY +
                ", players=" + players +
                ", bombs=" + bombs +
                ", weakStones=" + weakStones +
                ", exploded=" + exploded +
                ", blastRadiusPowerups=" + blastRadiusPowerups +
                ", bombCountPowerups=" + bombCountPowerups +
                ", serverTime=" + serverTime +
                ", suddenDeath=" + suddenDeath +
                '}';
    }
}
