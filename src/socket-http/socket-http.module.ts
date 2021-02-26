import { Module, HttpModule } from "@nestjs/common";
import { SocketHttpController } from "./socket-http.controller";

@Module({
    imports: [HttpModule],
    providers: [],
    controllers: [SocketHttpController],
})

export class SocketHttpModule {}