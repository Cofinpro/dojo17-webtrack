import { GameResources } from './game/gameresources';
import { Game } from './game/game';

export class GameStart {
    public game;

    constructor() {
        var resources = new GameResources();

        resources.addImage('burned-gras', './images/bomberman/0.png',32,32);
        resources.addImage('gras', './images/bomberman/1.png',32,32);
        resources.addImage('wall-light', './images/bomberman/91.png',32,32);
        resources.addImage('wall-dark', './images/bomberman/89.png',32,32);
        resources.addImage('box', './images/bomberman/90.png',32,32);

        resources.startLoading();
        this.checkResources(resources);

        // key event init
        document.body.onkeydown = this.checkReturn;

        document.getElementById('time').innerHTML = '00:00:00';
        this.timeCount(document.getElementById('time'));

    }

    checkResources(resources) {
        console.log('called');
        if(!resources.resourcesLoaded()){
            return setTimeout(this.checkResources, 500,resources);
        }
        this.game = new Game(resources);
        this.game.setUpPlayGround();
        //game.startGame();
    }

    checkReturn(e) {
        var event = window.event ? window.event : e;
        var keyCode = event.keyCode;
        if (keyCode == 13) {
            this.game.resetGame();
        }
        if (keyCode == 80) {
            if (this.game.isPaused()) {
                this.game.resumeGame();
            } else {
                this.game.pauseGame();
            }
        }
        if (keyCode == 83) {
            this.game.startGame();
        }
        if(event.altKey & event.ctrlKey && keyCode == 71){
            this.game.playGround.shieldTarget(this.game.hero, -1);
        }
    }

    timeCount(element) {

        if (this.game.end)return;

        if (!this.game.startedAt) {
            this.game.startedAt = Date.now();
        }
        var elapsed = Date.now() - this.game.startedAt;
        var centies = Math.ceil(elapsed / 10);
        var minutes = Math.floor(centies / 6000);
        var rest = centies % 6000;
        var secs = Math.floor(rest / 100);
        rest = rest % 100;

        element.innerHTML = ('00' + minutes).slice(-2) + ':' + ('00' + secs).slice(-2) + ':' + ('00' + rest).slice(-2);
        return window.setTimeout(this.timeCount, 50, element);
    }

}