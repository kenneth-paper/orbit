import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicationStatus } from "./applicationStatus.entity";
import { StatusGateway } from "./status.gateway";

@Injectable()
export class ApplicationStatusService {

    constructor(@InjectRepository(ApplicationStatus) private applicationStatusRepository: Repository<ApplicationStatus>, private statusGateway: StatusGateway) { }

    async getApplicationStatus(): Promise<ApplicationStatus> {
        return await this.applicationStatusRepository.findOne();
    }

    async updateApplicationStatus(applicationStatus: ApplicationStatus): Promise<number> {
        this.applicationStatusRepository.save(applicationStatus);// tambahin catch
        console.log("masuk ke sini");
        //use socket.io to send notification to connected client
        this.statusGateway.sendToAll('status');
        return await this.applicationStatusRepository.count();
    }
}