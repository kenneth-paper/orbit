import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { SocketSyncGateway } from "./socket.sync-gateway";

@Injectable()
export class SyncGatewayService {

    constructor( @Inject(forwardRef(() => SocketSyncGateway)) private syncGateway: SocketSyncGateway) { }

    async pushSyncStatus(data: any): Promise<any> {
        return this.syncGateway.pushStatus(data);
    }
}