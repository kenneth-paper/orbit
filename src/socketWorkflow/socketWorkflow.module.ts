import { Module } from "@nestjs/common";
import { SocketWorkflowService } from "./socketWorkflow.service";
import { SocketWorkflowController } from "./socketWorkflow.controller";
import { SocketWorkflow } from "./socket.workflow";

@Module({
    imports: [],
    providers: [SocketWorkflowService,SocketWorkflow],
    controllers: [SocketWorkflowController],
})

export class SocketWorkflowModule { }