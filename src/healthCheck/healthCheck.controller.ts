import {Controller, Get, Res} from '@nestjs/common';
import {Response} from 'express';

@Controller('api/v1/ping')
export class HealthCheckController {
    @Get()
    getPing(@Res() res: Response) {
        res.status(200).send({
            statusCode: 200,
            message: 'Ping!',
        });
    }
}
