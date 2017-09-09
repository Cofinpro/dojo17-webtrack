/**
 * Created by mhinz on 5/15/2016.
 */
export class ModalMessage {

    public static Error = 'error';
    public static Cheer = 'cheer';
    public static BadNews = 'bad-news';
   
    displayMillis;
    displayStyle;
    message;
    playGround;
    tag?: any;
    static messages = [];

    constructor(obj = {} as ModalMessage) {
        this.displayMillis = obj.displayMillis;
        this.displayStyle = obj.displayStyle;
        this.message = obj.message;
        this.playGround = obj.playGround;
        this.tag = null;
        ModalMessage.messages.push(this);
    }

    public show(): number {
        this.playGround.pause();
        const count = ModalMessage.messages.length;
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

    end() {
        this.tag.parentNode.removeChild(this.tag);
        const index = ModalMessage.messages.indexOf(this.tag);
        if (index > -1) {
            ModalMessage.messages.splice(index, 1);
        }
    };

    static clearAll() {
        for (var i = 0; i < ModalMessage.messages.length; i++) {
            var tag = ModalMessage.messages[i];
            tag.parentNode.removeChild(tag);
        }
        ModalMessage.messages = [];
    };
}