/**
 * Created by mhinz on 5/21/2016.
 */

function GameNotification(fadingInterval, displayStyle, top, left, message, context) {

    this.fadingInterval = fadingInterval;
    this.displayStyle = displayStyle;
    this.top = top;
    this.left = left;
    this.message = message;
    this.context = context;

    switch(displayStyle){
        case ModalMessage.BadNews:
            this.fillColor = '255,40,58';
            break;
        case ModalMessage.Cheer:
            this.fillColor = '20,255,58';
            break;
        default:
            this.fillColor = '0,0,0';
    }

    this.alpha = 1;
    this.context.font = '12px "Comic Sans MS"';
    this.context.textBaseline="top";
    this.textWidth = this.context.measureText(message).width;
    this.imageData = this.context.getImageData(this.left, this.top - 5, this.textWidth,25);
}

GameNotification.prototype.show = function () {
    this.fade(this);
};

GameNotification.prototype.fade = function (that) {

    that.context.putImageData(that.imageData, that.left, that.top - 5);
    that.alpha = that.alpha - that.fadingInterval;
    that.context.fillStyle = 'rgba(' + that.fillColor + ',' + that.alpha + ')';
    that.context.fillText(that.message, that.left, that.top);
    if(that.alpha > 0){
        return setTimeout(that.fade, 100, that);
    }
};
GameNotification.clearAll = function () {
    for (var i = 0; i < GameNotification.notifications.length; i++) {
        var tag = GameNotification.notifications[i];
        tag.parentNode.removeChild(tag);
    }
    GameNotification.notifications = [];
};
GameNotification.notifications = [];


