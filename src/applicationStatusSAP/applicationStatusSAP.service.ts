import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicationStatusSAP } from "./applicationStatusSAP.entity";
import { StatusGateway } from "./status.gateway";

@Injectable()
export class ApplicationStatusSAPService {
    constructor(
        @InjectRepository(ApplicationStatusSAP) private applicationStatusSAPRepository: Repository<ApplicationStatusSAP>,
        @Inject(forwardRef(() => StatusGateway)) private statusGateway: StatusGateway
        ) { }

    async getApplicationStatusSAP(): Promise<ApplicationStatusSAP> {
        return await this.applicationStatusSAPRepository.findOne();
    }

    async updateApplicationStatusSAP(applicationStatusSAP: ApplicationStatusSAP): Promise<number> {
        this.applicationStatusSAPRepository.save(applicationStatusSAP);
        this.statusGateway.handleStatusMessage(applicationStatusSAP);
        return await this.applicationStatusSAPRepository.count();
    }
}