import { Module } from "@nestjs/common";
import { SyncGatewayService } from "./syncGateway.service";
import { SyncGatewayController } from "./syncGateway.controller";
import { SocketSyncGateway } from "./socket.sync-gateway";

@Module({
    imports: [],
    providers: [SyncGatewayService,SocketSyncGateway],
    controllers: [SyncGatewayController],
})

export class SyncGatewayModule { }