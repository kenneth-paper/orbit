import { Module } from "@nestjs/common";
import { PushNotificationService } from "./pushNotification.service";
import { PushNotificationController } from "./pushNotification.controller";
import { SocketPushNotification } from "./socket.push-notification";

@Module({
    imports: [],
    providers: [PushNotificationService,SocketPushNotification],
    controllers: [PushNotificationController],
})

export class PushNotificationModule { }