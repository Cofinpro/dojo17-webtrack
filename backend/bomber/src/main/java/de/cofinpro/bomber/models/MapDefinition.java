package de.cofinpro.bomber.models;

import java.util.ArrayList;
import java.util.List;

public class MapDefinition {

    private int sizeX;
    private int sizeY;

    private List<Stone> fixStones = new ArrayList<>();
    private List<Stone> weakStones = new ArrayList<>();
    private List<BlastRadiusPowerup> blastRadiusPowerups = new ArrayList<>();
    private List<BombCountPowerup> bombCountPowerups = new ArrayList<>();
    private List<Bush> foliage = new ArrayList<>();

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

    public List<Stone> getFixStones() {
        return fixStones;
    }

    public void setFixStones(List<Stone> fixStones) {
        this.fixStones = fixStones;
    }

    public List<Stone> getWeakStones() {
        return weakStones;
    }

    public void setWeakStones(List<Stone> weakStones) {
        this.weakStones = weakStones;
    }

    public List<BombCountPowerup> getBombCountPowerups() {
        return bombCountPowerups;
    }

    public void setBombCountPowerups (List<BombCountPowerup> bombCountPowerups) {
        this.bombCountPowerups = bombCountPowerups;
    }

    public List<BlastRadiusPowerup> getBlastRadiusPowerups() {
        return blastRadiusPowerups;
    }

    public void setBlastRadiusPowerups (List<BlastRadiusPowerup> blastRadiusPowerups) {
        this.blastRadiusPowerups = blastRadiusPowerups;
    }

    public void setFoliage (List<Bush> foliage) {
        this.foliage = foliage;
    }

    public List<Bush> getFoliage() {
        return foliage;
    }

    @Override
    public String toString() {
        return "MapDefinition{" +
                "sizeX=" + sizeX +
                ", sizeY=" + sizeY +
                ", fixStones=" + fixStones +
                ", weakStones=" + weakStones +
                ", bombCountPowerups=" + bombCountPowerups + 
                ", blastRadiusPowerups=" + blastRadiusPowerups +
                ", foliage=" + foliage +
                '}';
    }
}
