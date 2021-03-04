import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { SocketWorkflow } from "./socket.workflow";

@Injectable()
export class SocketWorkflowService {

    constructor( @Inject(forwardRef(() => SocketWorkflow)) private socketWorkflow: SocketWorkflow) { }

    async sendSocketWorkflow(data: any): Promise<any> {
        return this.socketWorkflow.pushWorkflow(data);
    }
}