import { State } from './state';

export class Message {
    constructor(public inMsg: State, public outMsg: any) {
    }
}
