import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { Config } from "@libs/common/config";


@Processor(Config.CREATE_USER_QUEUE)
export class SendMailConsumer{
    private readonly logger = new Logger(SendMailConsumer.name);

    @Process()
    async transcode(job: Job<unknown>){
        this.logger.log('Start processing send email queue');
        this.logger.log(job.data);
        this.logger.log('End processing send email queue');
    }
}