package de.cofinpro.bomber.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class BlastRadiusPowerup implements Positionable {

    private int x;
    private int y;

    public BlastRadiusPowerup() {
    }

    public BlastRadiusPowerup(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    @Override
    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    @Override
    @JsonIgnore
    public Position getPosition() {
        return new Position(x, y);
    }

    @Override
    public String toString() {
        return "Stone{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}
