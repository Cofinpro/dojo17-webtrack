/**
 * Created by mhinz on 5/13/2016.
 */

function PlayGroundConfigurator(playGround, images) {

    this.playGround = playGround;
    this.images = images;

    document.body.onkeydown = checkReturn;

    this.configure = function () {
        this.addObstacles();
        this.addPickMeUps();
        this.addEnemies();
    };

    this.addObstacles = function () {
        var obstacle;

        var tree = this.images['tree'];

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

        var rock1 = this.images['rock1'];
        var rock2 = this.images['rock2'];
        var cactus1 = this.images['cactus1'];

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

    this.addPickMeUps = function () {
        var diamond = this.images['diamond'];
        var pick;

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
    this.addEnemies = function () {

        var ball = this.images['ball1'];
        var enemy;

        enemy = this.playGround.createPicture(75, 5, ball);
        this.playGround.addAutoMover(new AutonomousMover(enemy, this.playGround));
        this.playGround.addObstacle(enemy);

        enemy = this.playGround.createPicture(140, 85, ball);
        this.playGround.addAutoMover(new AutonomousMover(enemy, this.playGround));
        this.playGround.addObstacle(enemy);

        enemy = this.playGround.createPicture(300, 400, ball);
        this.playGround.addAutoMover(new AutonomousMover(enemy, this.playGround));
        this.playGround.addObstacle(enemy);

        enemy = this.playGround.createPicture(200, 550, ball);
        this.playGround.addAutoMover(new AutonomousMover(enemy, this.playGround));
        this.playGround.addObstacle(enemy);

        enemy = this.playGround.createPicture(100, 500, ball);
        this.playGround.addAutoMover(new AutonomousMover(enemy, this.playGround));
        this.playGround.addObstacle(enemy);

    };
}
module.exports = PlayGroundConfigurator;