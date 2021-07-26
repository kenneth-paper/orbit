import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicationStatusPayper } from "./applicationStatusPayper.entity";
import { StatusGateway } from "./status.gateway";

@Injectable()
export class ApplicationStatusPayperService {
    constructor(
        @InjectRepository(ApplicationStatusPayper) private applicationStatusPayperRepository: Repository<ApplicationStatusPayper>,
        @Inject(forwardRef(() => StatusGateway)) private statusGateway: StatusGateway
        ) { }

    async getApplicationStatusPayper(): Promise<ApplicationStatusPayper> {
        return await this.applicationStatusPayperRepository.findOne();
    }

    async updateApplicationStatusPayper(applicationStatusPayper: ApplicationStatusPayper): Promise<number> {
        this.applicationStatusPayperRepository.save(applicationStatusPayper);
        this.statusGateway.handleStatusMessage(applicationStatusPayper);
        return await this.applicationStatusPayperRepository.count();
    }
}