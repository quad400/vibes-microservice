import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TrackRepository } from './repos/track.repository';
import { CreateTrackDto } from './dto/create-track.dto';
import { Config } from '@libs/common/config';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ArtistEntity } from 'apps/user-service/src/artist/entities/artist.entity';
import { AlbumRepository } from '../album/repos/album.repository';
import { Response } from '@libs/common/utils/response';
import { UpdateTrackDto } from './dto/update-track.dto';
import { AlbumEntity } from '../album/entities/album.entity';

@Injectable()
export class TrackService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly albumRepository: AlbumRepository,

    @Inject(Config.USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  async addTrack(userId: string, data: CreateTrackDto) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist', { userId }),
    )) as ArtistEntity;

    if (data.album_id) {
      await this.albumRepository.findOne(data.album_id);
    }
    await this.trackRepository.create(
      { ...data, artist_id: artist.id },
      'title',
    );
    return Response.success(
      null,
      'Track created successfuly',
      HttpStatus.CREATED,
    );
  }

  async updateTrack(userId: string, trackId: string, data: UpdateTrackDto) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist', { userId }),
    )) as ArtistEntity;

    const track = await this.trackRepository.findOneData({
      data: { id: trackId, artist_id: artist.id },
    });

    let album: AlbumEntity;

    if (data.album_id) {
      album = await this.albumRepository.findOne(data.album_id);
    }

    const { album_id: _, ...rest } = data;
    const body = {
      ...rest,
      album_id: album.id,
    };

    await this.trackRepository.update(track.id, body);

    return Response.success(null, 'Track updated successfuly', HttpStatus.OK);
  }
}
