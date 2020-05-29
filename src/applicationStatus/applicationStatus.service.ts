import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicationStatus } from "./applicationStatus.entity";
import { StatusGateway } from "./status.gateway";
import { ApplicationStatusPayper } from "./applicationStatusPayper.entity";

@Injectable()
export class ApplicationStatusService {
    constructor(
        @InjectRepository(ApplicationStatus) private applicationStatusRepository: Repository<ApplicationStatus>,
        @InjectRepository(ApplicationStatusPayper) private applicationStatusPayperRepository: Repository<ApplicationStatusPayper>,
        @Inject(forwardRef(() => StatusGateway)) private statusGateway: StatusGateway
        ) { }

    async getApplicationStatus(): Promise<ApplicationStatus> {
        return await this.applicationStatusRepository.findOne();
    }

    async updateApplicationStatus(applicationStatus: ApplicationStatus): Promise<number> {
        this.applicationStatusRepository.save(applicationStatus);// tambahin catch
        //use socket.io to send notification to connected client
        this.statusGateway.sendToAll('status');
        return await this.applicationStatusRepository.count();
    }

    async getPayperApplicationStatus(): Promise<ApplicationStatusPayper> {
        return await this.applicationStatusPayperRepository.findOne();
    }

    async updatePayperApplicationStatus(applicationStatus: ApplicationStatusPayper): Promise<number> {
        this.applicationStatusPayperRepository.save(applicationStatus);// tambahin catch
        //use socket.io to send notification to connected client
        this.statusGateway.sendToAll('status');
        return await this.applicationStatusPayperRepository.count();
    }
}