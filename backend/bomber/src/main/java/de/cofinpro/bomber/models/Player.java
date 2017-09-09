package de.cofinpro.bomber.models;

public class Player implements Positionable {

    private String id;
    private String nickName;
    private int x;
    private int y;

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
    public Position getPosition() {
        return new Position(x, y);
    }
    @Override
    public String toString() {
        return "Player{" +
                "id='" + id + '\'' +
                ", nickName='" + nickName + '\'' +
                ", x=" + x +
                ", y=" + y +
                '}';
    }
}
