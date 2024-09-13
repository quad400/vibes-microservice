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
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { TrackLikeRepository } from './repos/track-like.repository';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SearchKey } from '@libs/common/enums/search.enum';
import { TrackType } from '@libs/common/enums/track.enum';
import { PlayRepository } from './repos/play.repository';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';

@Injectable()
export class TrackService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly trackLikeRepository: TrackLikeRepository,
    private readonly playRepository: PlayRepository,

    @InjectQueue(Config.TRACK_PLAY_QUEUE)
    private readonly trackPlayQueue: Queue,

    @Inject(Config.USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  async addTrack(userId: string, data: CreateTrackDto) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist', { userId }),
    )) as ArtistEntity;

    let album: AlbumEntity;
    if (data?.album_id) {
      album = await this.albumRepository.findOne(data?.album_id);

      const { album_id: _, ...rest } = data;
      const body = {
        ...rest,
        album_id: album.id,
        track_type: TrackType.ALBUM,
        artist_id: artist.id,
      };
      await this.trackRepository.create(body, 'title');
      return Response.success(
        null,
        'Track created successfuly',
        HttpStatus.CREATED,
      );
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
      options: { where: { id: trackId, artist_id: artist.id } },
    });

    let album: AlbumEntity;

    if (data.album_id) {
      album = await this.albumRepository.findOne(data.album_id);
    }

    await this.trackRepository.update(track.id, data, 'title');

    return Response.success(null, 'Track updated successfuly', HttpStatus.OK);
  }

  async getAllTracks(query: QueryOptionsDto) {
    const { keywords, limit, page } = query;

    const result = await this.trackRepository.paginatedFind({
      options: {
        relations: {
          album: true,
        },
      },
      searchKey: SearchKey.TITLE,
      page,
      limit,
      search: keywords,
    });
    const results = await Promise.all(
      result.data.map(async (track) => {
        const artist = (await lastValueFrom(
          this.userClient.send('get_artist_by_id', {
            artistId: track.artist_id,
          }),
        )) as ArtistEntity;

        // Combine album with artist details
        return {
          ...track,
          artist,
        };
      }),
    );

    const data = {
      currentPage: result.currentPage,
      total: result.total,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
      results: results,
    };

    return Response.success(
      data,
      'Tracks retrieved Successfully',
      HttpStatus.OK,
    );
  }

  async getTrack({
    trackId,
    userId,
    isPlay = true,
  }: {
    trackId: string;
    userId?: string;
    isPlay?: boolean;
  }) {
    if (isPlay) {
      await this.trackPlayQueue.add({ trackId, userId });
    }

    let track = await this.trackRepository.findOne(trackId);
    track = await this.trackRepository.update(trackId, {
      track_plays_count: track.track_plays_count + 1,
    });
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist_by_id', {
        artistId: track.artist_id,
      }),
    )) as ArtistEntity;

    return Response.success(
      { ...track, artist },
      'Track retrieved successfully',
      HttpStatus.OK,
    );
  }

  async deleteTrack(userId: string, trackId: string) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist', { userId }),
    )) as ArtistEntity;

    await this.trackRepository.findOneData({
      options: { where: { artist_id: artist.id, id: trackId } },
    });
    await this.trackRepository.softDelete(trackId);

    return Response.success(
      null,
      'Track deleted successfuly',
      HttpStatus.CREATED,
    );
  }

  async getRecentlyPlays(userId: string, query: QueryOptionsDto) {
    const { limit, page } = query;

    // Step 1: Fetch the user's recently played tracks, ordered by the most recent play
    const recentPlays = await this.playRepository.findAll({
      options: {
        where: { user_id: userId },
        relations: { track: true }, // Load track details
        order: { created_at: 'DESC' }, // Assuming `played_at` is the timestamp when track was played
      },
    });

    // Step 2: Remove duplicate tracks, keeping only the most recent play
    const uniqueTracks = recentPlays.reduce(
      (acc: Record<string, any>, play) => {
        // If the track hasn't been added yet, add it
        if (!acc[play.track.id]) {
          acc[play.track.id] = play;
        }
        return acc;
      },
      {},
    );

    // Step 3: Convert the unique tracks back to an array
    const uniqueTrackList = Object.values(uniqueTracks);

    // Step 4: Paginate the results
    const total = uniqueTrackList.length;
    const paginatedTracks = uniqueTrackList.slice(
      (page - 1) * limit,
      page * limit,
    );

    // Step 5: Return the paginated data with pagination info
    return Response.success(
      {
        total,
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
        data: paginatedTracks,
      },
      'Recently played tracks retrieved successfully',
      HttpStatus.OK,
    );
  }

  async likeUnLikeTrack(userId: string, trackId: string) {
    const existingLike = await this.trackLikeRepository.findOneData({
      options: {
        where: {
          user_id: userId,
          track_id: trackId,
        },
      },
      bypassExistenceCheck: true,
    });

    const track = await this.trackRepository.findOne(trackId);
    if (existingLike) {
      await this.trackRepository.update(trackId, {
        track_likes_count: track.track_likes_count - 1,
      });
      await this.trackLikeRepository.delete(existingLike.id);
      return Response.success(
        null,
        'Track unliked successfully',
        HttpStatus.OK,
      );
    } else {
      await this.trackRepository.update(trackId, {
        track_likes_count: track.track_likes_count + 1,
      });
      await this.trackLikeRepository.createWithoutUniqueCheck({
        user_id: userId,
        track_id: trackId,
      });
    }
    return Response.success(null, 'Track liked successfully', HttpStatus.OK);
  }

  async getTrackLikes(trackId: string, query: QueryOptionsDto) {
    const { limit, page } = query;

    const result = await this.trackLikeRepository.paginatedFind({
      options: {
        where: {
          track_id: trackId,
        },
        order: { created_at: 'DESC' },
      },
      page,
      limit,
    });

    const results = await Promise.all(
      result.data.map(async (track) => {
        const user = (await lastValueFrom(
          this.userClient.send('get_user', { userId: track.user_id }),
        )) as UserEntity;

        // Combine track with user details
        return {
          ...track,
          user,
        };
      }),
    );

    const data = {
      currentPage: result.currentPage,
      total: result.total,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
      results: results,
    };

    return Response.success(
      data,
      'Track likes retrieved successfully',
      HttpStatus.OK,
    );
  }
}
