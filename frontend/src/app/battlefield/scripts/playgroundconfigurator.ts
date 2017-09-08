/**
 * Created by mhinz on 5/13/2016.
 */

export class PlayGroundConfigurator{

    constructor(private playGround : any, private images : any){
        //TODO Fix me
        document.body.onkeydown = checkReturn;
    }

    configure() {
        this.addObstacles();
        this.addPickMeUps();
        this.addEnemies();
    };

    addObstacles() {
        let obstacle;

        let tree = this.images['tree'];

        obstacle = this.playGround.createPicture(160,170, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(160,110, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(160,70, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(240, 210, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(245, 270, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(50, 300, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(50, 350, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(130, 660, tree, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(120, 620, tree, true);
        this.playGround.addObstacle(obstacle);

        let rock1 = this.images['rock1'];
        let rock2 = this.images['rock2'];
        let cactus1 = this.images['cactus1'];

        obstacle = this.playGround.createPicture(410, 550, rock1, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(380, 605, rock2, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(355, 570, cactus1, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(475, 60, cactus1, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(450, 115, rock2, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(200, 420, rock2, true);
        this.playGround.addObstacle(obstacle);

        obstacle = this.playGround.createPicture(240, 460, rock2, true);
        this.playGround.addObstacle(obstacle);

    };

    addPickMeUps() {
        let diamond = this.images['diamond'];
        let pick;

        pick = this.playGround.createPicture(150, 300, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(440, 20, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(50, 200, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(50, 410, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(550, 750, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(350, 550, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(305, 190, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);

        pick = this.playGround.createPicture(150, 725, diamond);
        this.playGround.addPickItUp(pick);
        this.playGround.addObstacle(pick);
    };

    addEnemies(){
        let ball = this.images['ball1'];
    };
}
