/**
 *
 */
function Game(resources) {

    this.images = resources.images;
    this.audios = resources.audios;

    var that = this;
    this.liveCount = 3;
    this.end = false;

    this.playGroundConfugurator = null;
    this.playGround = null;

    this.startedAt = null;
    this.hero = null;
    this.animator = null;


    this.counterTag = document.getElementById('picks');
    this.livesTag = document.getElementById('lives');

    this.setUpPlayGround = function () {

        var playGroundElement = document.getElementById('play-ground');
        playGroundElement.innerHTML = '';
        that.counterTag.innerHTML = '';

        that.playGround = new PlayGround(playGroundElement, 600, 800);

        that.playGround.setPickItUpCallBack(that.picked);
        that.playGround.setTargetCaughtCallBack(that.caught);

        that.playGroundConfugurator = new PlayGroundConfigurator(that.playGround, that.images);
        that.playGroundConfugurator.configure();

        var l = document.getElementById('lives');
        l.innerHTML = '';
        for (var i = 0; i < that.liveCount; i++) {
            var im = new Image();
            im.src = that.images['hero-right'].getImageSource();
            im.height = 32;
            im.width = 32;
            l.appendChild(im);
        }

        this.placeHero();
        //that.placeCockpit();
    };
    this.placeCockpit = function () {
        //var cockpit = document.getElementById('game-cockpit');
        ////cockpit.innerHTML = '';
        //cockpit.style.position = 'absolute';
        //cockpit.style.top = '700px';
        //cockpit.style.left = '750px';
    };

    this.placeHero = function () {
        that.playGround.removeGameElement(that.hero);

        var heroImages = {};
        heroImages['up'] = that.images['hero-up'];
        heroImages['down'] = that.images['hero-down'];
        heroImages['left'] = that.images['hero-left'];
        heroImages['right'] = that.images['hero-right'];

        that.hero = that.playGround.createPicture(5, 5, heroImages['right']);
        that.animator = new TagAnimator(that.hero, that.playGround);
        that.animator.setImages(heroImages);
        that.playGround.addTarget(that.hero);
    };
    this.picked = function (pickItUps) {

        if(pickItUps.length == 0)return;

        var i;
        for(i = 0; i < pickItUps.length; i++){
            var pickItUp = pickItUps[i];
            var top = pickItUp.top;
            var left = pickItUp.left;

            that.playGround.removeGameElement(pickItUp);

            var finished = that.playGround.getPickItUps().length == 0;

            var im = new Image();
            im.src = that.images['diamond'].getImageSource();
            that.counterTag.appendChild(im);

            if (finished) {
                new ModalMessage(-1, ModalMessage.Cheer, 'You Win!!', that.playGround).show();
                that.audios['win'].volume = '0.2';
                that.audios['win'].play();
                that.shutDownGame();
            } else {
                that.playGround.showNotification(0.05, ModalMessage.Cheer, top, left, 'Pick!!');
                that.audios['pick'].play();
            }

        }

    };

    this.caught = function (target) {

        that.animator.stop();

        var current = that.livesTag.childElementCount;
        that.livesTag.removeChild(that.livesTag.firstElementChild);
        var next = current - 1;
        if (next <= 0) {
            new ModalMessage(-1, ModalMessage.BadNews, 'Lost!!', that.playGround).show();
            that.audios['lost'].volume = 0.2;
            that.audios['lost'].play();
            that.shutDownGame();
        } else {
            target.clear();
            that.playGround.removeGameElement(that.animator.element);
            new ModalMessage(5000, ModalMessage.BadNews, 'Caught!!', that.playGround).show();
            that.audios['caught'].volume = 0.2;
            that.audios['caught'].play();

            that.placeHero();
            that.playGround.shieldTarget(that.hero, 7000);
            that.animator.start();
        }
    };
}
Game.prototype.setKeyDown = function (keyCode) {
    if (!this.animator) return;
    this.animator.setKeyDown(keyCode);
};
Game.prototype.setKeyUp = function (keyCode) {
    if (!this.animator) return;
    this.animator.setKeyUp(keyCode);
};
Game.prototype.startGame = function () {
    var that = this;
    document.onkeydown = function(e){
        var event = window.event ? window.event : e;
        var keyCode = event.keyCode;
        var dir;
        switch(keyCode){
            case 37:
                dir = Direction.left;
                break;
            case 39:
                dir = Direction.right;
                break;
            case 38:
                dir = Direction.up;
                break;
            case 40:
                dir = Direction.down;
                break;
        }
        that.animator.addToActiveDirections(dir);
    };
    document.onkeyup = function(e){
        var event = window.event ? window.event : e;
        var keyCode = event.keyCode;
        var dir;
        switch(keyCode){
            case 37:
                dir = Direction.left;
                break;
            case 39:
                dir = Direction.right;
                break;
            case 38:
                dir = Direction.up;
                break;
            case 40:
                dir = Direction.down;
                break;
        }
        that.animator.removeFromActiveDirections(dir);
    };

    if (this.end) {
        this.resetGame();
        return;
    }
    this.audios['loop'].loop = true;
    this.audios['loop'].volume = 0.8;
    this.audios['loop'].play();

    this.animator.start();
    this.playGround.startMovers();
    //this.playGround.shieldTarget(this.hero, 2000);
    this.startedAt = null;
    this.end = false;
    document.getElementById('time').innerHTML = '00:00:00';
    timeCount(document.getElementById('time'));
};

Game.prototype.resetGame = function () {
    if (!this.end)this.shutDownGame();
    ModalMessage.clearAll();
    this.end = false;
    this.setUpPlayGround();
    this.startGame();
};
Game.prototype.shutDownGame = function () {
    this.end = true;
    this.audios['loop'].load();
    this.playGround.stopMovers();
    document.onkeydown = null;
    document.onkeyup = null;
    this.animator.stop();
    this.animator = null;
};
Game.prototype.resumeGame = function () {
    this.playGround.endPause();
};
Game.prototype.pauseGame = function (millis) {
    this.playGround.pause();
    if (millis) {
        return setTimeout(this.resumeGame, millis);
    }
};
Game.prototype.isPaused = function () {
    return this.playGround.isPaused();
};