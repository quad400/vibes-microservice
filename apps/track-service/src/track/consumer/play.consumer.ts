import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Config } from '@libs/common/config';
import { TrackRepository } from '../repos/track.repository';
import { PlayRepository } from '../repos/play.repository';

@Processor(Config.TRACK_PLAY_QUEUE)
export class TrackPlayConsumer {
  constructor(
    private trackRepository: TrackRepository,
    private playRepository: PlayRepository,
  ) {}

  @Process()
  async transcode(job: Job<unknown>) {
    const trackId = job.data['trackId'];
    const userId = job.data['userId'];
    const track = await this.trackRepository.findOne(trackId);
    await this.playRepository.createWithoutUniqueCheck({
      user_id: userId,
      track_id: track.id,
    });
  }
}
