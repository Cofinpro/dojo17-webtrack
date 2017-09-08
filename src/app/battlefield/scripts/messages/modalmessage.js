/**
 * Created by mhinz on 5/15/2016.
 */
function ModalMessage(displayMillis, displayStyle, message, playGround) {

    this.displayMillis = displayMillis;
    this.displayStyle = displayStyle;
    this.message = message;
    this.playGround = playGround;

    this.tag = null;


}
ModalMessage.prototype.show = function () {
    this.playGround.pause();
    var count = ModalMessage.messages.length;
    this.tag = document.createElement('p');

    ModalMessage.messages[count] = this.tag;
    var pgPosition = this.playGround.getPosition();

    var top = (this.playGround.height / 2) + 'px';
    var left = (this.playGround.width / 2) + 'px';

    this.tag.innerHTML = this.message;
    this.tag.style.position = 'absolute';
    this.tag.style.top = top;
    this.tag.style.left = left;
    this.tag.classList.add('message');
    this.tag.classList.add(this.displayStyle);
    var animationString;
    if (this.displayMillis > -1) {
        var animationTime = Math.ceil(this.displayMillis / 1000);
        animationString = 'message-animation ' + animationTime + 's';
    } else {
        animationString = 'message-animation-end 10s';
        this.tag.style.opacity = '0.8';
    }
    this.tag.style.animation = animationString;

    document.body.appendChild(this.tag);
    if (this.displayMillis > -1) {
        return setTimeout(this.end, this.displayMillis, this);
    }

};

ModalMessage.prototype.end = function (that) {
    that.playGround.endPause();
    if(!that.parentNode)return;

    that.tag.parentNode.removeChild(that.tag);
    var index =  ModalMessage.messages.indexOf(that.tag);
    if(index > -1){
        ModalMessage.messages.splice(index, 1);
    }
};
ModalMessage.clearAll = function () {
    for (var i = 0; i < ModalMessage.messages.length; i++) {
        var tag = ModalMessage.messages[i];
        tag.parentNode.removeChild(tag);
    }
    ModalMessage.messages = [];
};

ModalMessage.Error = 'error';
ModalMessage.Cheer = 'cheer';
ModalMessage.BadNews = 'bad-news';

ModalMessage.messages = [];
