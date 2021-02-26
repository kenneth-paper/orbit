import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { SocketPushNotification } from "./socket.push-notification";

@Injectable()
export class PushNotificationService {

    constructor( @Inject(forwardRef(() => SocketPushNotification)) private pushNotification: SocketPushNotification) { }

    async sendPushNotification(data: any): Promise<any> {
        return this.pushNotification.pushNotification(data);
    }
}