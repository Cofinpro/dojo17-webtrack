package de.cofinpro.bomber.models;

import java.time.LocalDateTime;

public class Bomb {

    private String id;
    private String userId;
    private int x;
    private int y;
    private LocalDateTime detonateAt;

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

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

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
}
