import { ModalMessage } from './modalmessage'

/**
 * Created by mhinz on 5/21/2016.
 */

export class GameNotification {

  fadingInterval: any;
  displayStyle: any;
  top: any;
  left: any;
  message: any;
  context: any;
  fillColor: any;
  alpha: any;
  textWidth: any;
  imageData: any;
  notifications: any[];

  constructor(fadingInterval, displayStyle, top, left, message, context) {
    this.fadingInterval = fadingInterval;
    this.displayStyle = displayStyle;
    this.top = top;
    this.left = left;
    this.message = message;
    this.context = context;
    this.alpha = 1;


    switch (displayStyle) {
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
    this.context.textBaseline = "top";
    this.textWidth = this.context.measureText(message).width;
    this.imageData = this.context.getImageData(this.left, this.top - 5, this.textWidth, 25);

  }

  public show() {
    this.fade(this);
  };

  public fade(that) {

    that.context.putImageData(that.imageData, that.left, that.top - 5);
    that.alpha = that.alpha - that.fadingInterval;
    that.context.fillStyle = 'rgba(' + that.fillColor + ',' + that.alpha + ')';
    that.context.fillText(that.message, that.left, that.top);
    if (that.alpha > 0) {
      return setTimeout(that.fade, 100, that);
    }
  };

  public clearAll() {
    for (var i = 0; i < this.notifications.length; i++) {
      var tag = this.notifications[i];
      tag.parentNode.removeChild(tag);
    }
    this.notifications = [];
  };
}

