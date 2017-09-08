/**
 * Created by mhinz on 5/18/2016.
 */

var game;
function init(){
    var resources = new GameResources();

    resources.addImage('hero-right', './images/hero-right.png',42,42);
    resources.addImage('hero-left', './images/hero-left.png',42,42);
    //resources.addImage('hero-up', './images/hero-up.png');
    //resources.addImage('hero-down', './images/hero-down.png');
    resources.addImage('diamond', './images/diamond1.png',20,20);
    resources.addImage('tree', './images/tree1.png',80,120);
    resources.addImage('rock1', './images/rock1.png', 65,68);
    resources.addImage('rock2', './images/rock2.png', 65,60);
    resources.addImage('cactus1', './images/cactus1.png',63,60);
    resources.addImage('ball1', './images/ball3.png',20,20);

    resources.addAudio('pick', './audio/pick.mp3');
    resources.addAudio('caught', './audio/caught.mp3');
    resources.addAudio('lost', './audio/lost.mp3');
    resources.addAudio('win', './audio/win.mp3');
    resources.addAudio('loop', './audio/loop.mp3');
    resources.startLoading();
    checkResources(resources);

}
function checkResources(resources){
    console.log('called');
    if(!resources.resourcesLoaded()){
        return setTimeout(checkResources, 500,resources);
    }
    game = new Game(resources);
    game.setUpPlayGround();
    //game.startGame();
}
function checkReturn(e) {
    var event = window.event ? window.event : e;
    var keyCode = event.keyCode;
    if (keyCode == 13) {
        game.resetGame();
    }
    if (keyCode == 80) {
        if (game.isPaused()) {
            game.resumeGame();
        } else {
            game.pauseGame();
        }
    }
    if (keyCode == 83) {
        game.startGame();
    }
    if(event.altKey & event.ctrlKey && keyCode == 71){
        game.playGround.shieldTarget(game.hero, -1);
    }
}

function timeCount(element) {

    if (game.end)return;

    if (!game.startedAt) {
        game.startedAt = Date.now();
    }
    var elapsed = Date.now() - game.startedAt;
    var centies = Math.ceil(elapsed / 10);
    var minutes = Math.floor(centies / 6000);
    var rest = centies % 6000;
    var secs = Math.floor(rest / 100);
    rest = rest % 100;

    element.innerHTML = ('00' + minutes).slice(-2) + ':' + ('00' + secs).slice(-2) + ':' + ('00' + rest).slice(-2);
    return window.setTimeout(timeCount, 50, element);
}