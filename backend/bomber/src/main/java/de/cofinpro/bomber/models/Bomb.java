package de.cofinpro.bomber.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

public class Bomb implements Positionable {

    private String id;
    private String userId;
    private int x;
    private int y;
    private LocalDateTime detonateAt;
    private int blastRadius;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public LocalDateTime getDetonateAt() {
        return detonateAt;
    }

    public void setDetonateAt(LocalDateTime detonateAt) {
        this.detonateAt = detonateAt;
    }

    @Override
    @JsonIgnore
    public Position getPosition() {
        return new Position(x, y);
    }

    public void setBlastRadius(int blastRadius) {
        this.blastRadius = blastRadius;
    }

    public int getBlastRadius () {
        return blastRadius;
    }

    @Override
    public String toString() {
        return "Bomb{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", x=" + x +
                ", y=" + y +
                ", detonateAt=" + detonateAt +
                ", blastRadius=" + blastRadius +
                '}';
    }
}
