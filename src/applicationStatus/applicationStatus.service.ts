import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicationStatus } from "./applicationStatus.entity";
import { StatusGateway } from "./status.gateway";

@Injectable()
export class ApplicationStatusService {
    constructor(
        @InjectRepository(ApplicationStatus) private applicationStatusRepository: Repository<ApplicationStatus>,
        @Inject(forwardRef(() => StatusGateway)) private statusGateway: StatusGateway
        ) { }

    async getApplicationStatus(): Promise<ApplicationStatus> {
        return await this.applicationStatusRepository.findOne();
    }

    async updateApplicationStatus(applicationStatus: ApplicationStatus): Promise<number> {
        this.applicationStatusRepository.save(applicationStatus);
        this.statusGateway.handleStatusMessage(applicationStatus);
        return await this.applicationStatusRepository.count();
    }
}