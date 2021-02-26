import { Module } from "@nestjs/common";
import { PushNotificationService } from "./pushNotification.service";
import { PushNotificationController } from "./pushNotification.controller";
import { SocketPushNotification } from "./socket.push-notification";
import { RedisIoAdapter } from './redis-io.adapter';

@Module({
    imports: [],
    providers: [PushNotificationService,SocketPushNotification, RedisIoAdapter],
    controllers: [PushNotificationController],
})

export class PushNotificationModule { }