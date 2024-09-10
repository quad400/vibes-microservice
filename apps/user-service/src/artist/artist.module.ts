import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './repos/artist.repository';
import { UserRepository } from '../user/repos/user.repository';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository, UserRepository],
})
export class ArtistModule {}

