export class Message {

    constructor(public text: string) {
    }

    static factory(raw: any): Message {
        const message: Message = new Message(raw.text);
        return message;
    }

}
