package de.cofinpro.bomber.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class StateDiff {

    private int sizeX;
    private int sizeY;
    private List<Player> addedPlayers = new ArrayList<>();
    private List<Player> killedPlayers = new ArrayList<>();
    
    private List<Stone> addedWeakStones = new ArrayList<>();
    private List<Stone> destroyedWeakStones = new ArrayList<>();
   
    private List<BombCountPowerup> addedBombCountPowerups = new ArrayList<>();
    private List<BombCountPowerup> collectedBombCountPowerups = new ArrayList<>();

    private List<BlastRadiusPowerup> addedBlastRadiusPowerups = new ArrayList<>();
    private List<BlastRadiusPowerup> collectedBlastRadiusPowerups = new ArrayList<>();

    private List<Bomb> addedBombs = new ArrayList<>();
    private List<Bomb> explodedBombs = new ArrayList<>();
    
    private List<Position> addedExplosions = new ArrayList<>();
    private List<Position> doneExplosions = new ArrayList<>();
    
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

    public List<Player> getAddedPlayers() {
        return addedPlayers;
    }
    public List<Player> getKilledPlayers() {
        return killedPlayers;
    }

    public void addNewPlayer(Player newPlayer){
        addedPlayers.add(newPlayer);
    }
    public void addKilledPlayer(Player killedPlayer){
        killedPlayers.add(killedPlayer);
    }
    
    public List<Stone> getAddedWeakStones() {
        return addedWeakStones;
    }
    public List<Stone> getDestroyedWeakStones() {
        return destroyedWeakStones;
    }
    public void addNewPWeakStone(Stone stone){
        addedWeakStones.add(stone);
    }
    public void addDestroyedWeakStone(Stone stone){
        destroyedWeakStones.add(stone);
    }


    public List<BombCountPowerup> getAddedBombCountPowerups() {
        return addedBombCountPowerups;
    }
    public List<BombCountPowerup> getCollectedBombCountPowerups() {
        return collectedBombCountPowerups;
    }

    public void addNewBombCountPowerup(BombCountPowerup bombCountPowerup) {
        this.addedBombCountPowerups.add(bombCountPowerup);
    }
    public void addCollectedBombCountPowerup(BombCountPowerup bombCountPowerup) {
        this.collectedBombCountPowerups.add(bombCountPowerup);
    }

    public List<BlastRadiusPowerup> getAddedBlastRadiusPowerups() {
        return addedBlastRadiusPowerups;
    }
    public List<BlastRadiusPowerup> getCollectedBlastRadiusPowerups() {
        return collectedBlastRadiusPowerups;
    }

    public void addNewBlastRadiusPowerup(BlastRadiusPowerup blastRadiusPowerup) {
            this.addedBlastRadiusPowerups.add(blastRadiusPowerup);
    }
    public void addCollectedBlastRadiusPowerup(BlastRadiusPowerup blastRadiusPowerup) {
            this.collectedBlastRadiusPowerups.add(blastRadiusPowerup);
    }
    

    public List<Bomb> getAddedBombs() {
        return addedBombs;
    }
    public List<Bomb> getExplodedBombs() {
        return explodedBombs;
    }

    public void addNewBomb(Bomb bomb) {
        addedBombs.add(bomb);
    }
    public void addExplodedBomb(Bomb bomb) {
        explodedBombs.add(bomb);
    }

    public List<Position> getAddedExploded() {
        return addedExplosions;
    }
    public List<Position> getDoneExploded() {
        return doneExplosions;
    }

    public void addNewExploded(Position position){
        addedExplosions.add(position);
    }
   public void addDoneExploded(Position position){
        doneExplosions.add(position);
    }

    public Long getServerTime() {
        return serverTime;
    }

    public void setServerTime(Long serverTime) {
        this.serverTime = serverTime;
    }

    // public void removeBombCountPowerup(Position position) {
    //     BombCountPowerup found = null;
    //     for (BombCountPowerup powerup: bombCountPowerups) {
    //         if (powerup.getPosition().equals(position)) {
    //             found = powerup;
    //         }
    //     }
    //     bombCountPowerups.remove(found);
    // }

    // public void removeBlastRadiusPowerup(Position position) {
    //     BlastRadiusPowerup found = null;
    //     for (BlastRadiusPowerup powerup: blastRadiusPowerups) {
    //         if (powerup.getPosition().equals(position)) {
    //             found = powerup;
    //         }
    //     }
    //     blastRadiusPowerups.remove(found);
    // }

    // public void addBlastRadiusPowerup(Position position) {
    //     blastRadiusPowerups.add(new BlastRadiusPowerup(position.getX(), position.getY()));
    // }

    // public void addBombCountPowerup(Position position) {
    //     bombCountPowerups.add(new BombCountPowerup(position.getX(), position.getY()));
    // }

    public boolean isSuddenDeath() {
        return suddenDeath;
    }

    public void setSuddenDeath(boolean suddenDeath) {
        this.suddenDeath = suddenDeath;
    }

    @Override
    public String toString() {
        return "StateDiff{" +
                "sizeX=" + sizeX +
                ", sizeY=" + sizeY +
                ", players={" +
                "new=" + addedPlayers +
                ", killed=" + killedPlayers +
                "}" +
                ", bombs={" + 
                "new=" + addedBombs +
                ", exploded=" + explodedBombs +
                "}" +
                ", weakStones={" +
                "new=" + addedWeakStones +
                ", destroyed=" + destroyedWeakStones +
                "}" +
                ", exploded={" +
                "new=" + addedExplosions +
                ", done=" + doneExplosions +
                "}" +
                ", blastRadiusPowerups={" +
                "new=" + addedBlastRadiusPowerups +
                ", collected=" + collectedBlastRadiusPowerups +
                "}" +
                ", bombCountPowerups={" +
                "new=" + addedBombCountPowerups +
                ", collected=" + collectedBombCountPowerups +
                "}" +
                ", serverTime=" + serverTime +
                ", suddenDeath=" + suddenDeath +
                '}';
    }
}
