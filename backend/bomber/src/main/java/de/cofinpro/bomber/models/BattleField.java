package de.cofinpro.bomber.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class BattleField {

    private List<Stone> fixStones = new ArrayList<>();
    private List<Bush> foliage = new ArrayList<>();

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
                ", fixStones=" + fixStones +
                ", foliage=" + foliage +
                '}';
    }
}
