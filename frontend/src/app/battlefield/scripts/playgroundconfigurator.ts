/**
 * Created by mhinz on 5/13/2016.
 */

export class PlayGroundConfigurator {

    constructor(private playGround: any, private images: any){
    }

    configure() {
        this.addObstacles();
        // this.addPickMeUps();
    };

    addObstacles() {

        var wallDark = this.images['wall-dark'];
        var wallLight = this.images['wall-light'];
        let obstacle;

        for (var y = 0; y < 17; y++) {
            for (var x = 0; x < 17; x++) {
                if (x == 0 && y == 0 || x == 16 && y == 0) {
                    obstacle = this.playGround.createPicture(y*32 , x*32, wallLight, true);
                    this.playGround.addObstacle(obstacle);
                } else if(y == 0 || y == 16) {
                    obstacle = this.playGround.createPicture(y*32 , x*32, wallDark, true);
                    this.playGround.addObstacle(obstacle);
                } else if(x == 0 || x == 16) {
                    obstacle = this.playGround.createPicture(y*32 , x*32, wallLight, true);
                    this.playGround.addObstacle(obstacle);
                } else if(x % 2 == 0 && y % 2 == 0) {
                    obstacle = this.playGround.createPicture(y*32 , x*32, wallLight, true);
                    this.playGround.addObstacle(obstacle);
                }
            }
        }

    };

    addPickMeUps() {
        // let diamond = this.images['diamond'];
        // let pick;

        // pick = this.playGround.createPicture(150, 300, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(440, 20, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(50, 200, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(50, 410, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(550, 750, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(350, 550, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(305, 190, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);

        // pick = this.playGround.createPicture(150, 725, diamond);
        // this.playGround.addPickItUp(pick);
        // this.playGround.addObstacle(pick);
    };

    // addEnemies(){
    //     let ball = this.images['ball1'];
    // };
}
