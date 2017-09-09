package de.cofinpro.bomber.models;

public class NewPlayer {

    private String id;
    private String nickName;

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
    public String toString() {
        return "NewPlayer{" +
                "id='" + id + '\'' +
                ", nickName='" + nickName + '\'' +
                '}';
    }
}
