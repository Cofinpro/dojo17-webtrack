package de.cofinpro.bomber.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class BattleField {

    private int sizeX;
    private int sizeY;
    private List<Stone> fixStones = new ArrayList<>();
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
        this.fixStones.clear();
        if (fixStones != null) {
            this.fixStones.addAll(fixStones);
        }
    }

    public List<Bush> getFoliage() {
        return foliage;
    }

    public void setFoliage(List<Bush> foliage) {
        this.foliage = foliage;
    }

    @Override
    public String toString() {
        return "BattleField{" +
                "sizeX=" + sizeX +
                ", sizeY=" + sizeY +
                ", fixStones=" + fixStones +
                ", foliage=" + foliage +
                '}';
    }
}
