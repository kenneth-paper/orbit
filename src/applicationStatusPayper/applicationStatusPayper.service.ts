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

  async getApplicationStatus(): Promise<ApplicationStatusPayper> {
    return await this.applicationStatusPayperRepository.findOne();
  }

  async updateApplicationStatus(applicationStatus: ApplicationStatusPayper): Promise<any> {
    let result = await this.applicationStatusPayperRepository.save(applicationStatus);// tambahin catch
    //use socket.io to send notification to connected client
    this.statusGateway.sendToAll('status',result);
    return result;
  }
}