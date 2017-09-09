package de.cofinpro.bomber.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Player implements Positionable {

    private String id;
    private String nickName;
    private int x;
    private int y;
    private int blastRadius;
    private int bombCount;
    private long score;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
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

    public void setBlastRadius(int blastRadius) {
        this.blastRadius = blastRadius;
    }

    public int getBlastRadius () {
        return blastRadius;
    }

    public int getBombCount() {
        return bombCount;
    }

    public void setBombCount(int bombCount) {
        this.bombCount = bombCount;
    }

    public long getScore() {
        return score;
    }

    public void setScore(long score) {
        this.score = score;
    }

    public void increaseBlastRadius() {
        blastRadius++;
    }

    public void increaseBombCount() {
        bombCount++;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id='" + id + '\'' +
                ", nickName='" + nickName + '\'' +
                ", x=" + x +
                ", y=" + y +
                ", blastRadius=" + blastRadius +
                ", bombCount=" + bombCount +
                ", score=" + score +
                '}';
    }
}
