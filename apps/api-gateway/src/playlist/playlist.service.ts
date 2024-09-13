import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PlaylistRepository } from './repos/playlist.repository';
import { PlaylistTrackRepository } from './repos/playlist-tracks.repository';
import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  UpdatePlaylistDto,
} from './dto/playlist.dto';
import { Config } from '@libs/common/config';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import { Response } from '@libs/common/utils/response';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { SearchKey } from '@libs/common/enums/search.enum';
import { TrackEntity } from 'apps/track-service/src/track/entities/track.entity';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly playlistTrackRepository: PlaylistTrackRepository,
    @Inject(Config.TRACK_SERVICE) private readonly trackClient: ClientProxy,
  ) {}

  async createPlaylist(userId: string, playlist: CreatePlaylistDto) {
    await this.playlistRepository.create(
      { ...playlist, user_id: userId },
      'title',
    );
    return Response.success(
      null,
      'Playlist Created Successfully',
      HttpStatus.CREATED,
    );
  }

  async getPlaylist(playlistId: string) {
    const playlist = await this.playlistRepository.findOne(playlistId);

    return Response.success(
      playlist,
      'Playlist Retrieved Successfully',
      HttpStatus.OK,
    );
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    data: UpdatePlaylistDto,
  ) {
    const playlist = await this.playlistRepository.findOneData({
      options: {
        where: {
          user_id: userId,
          id: playlistId,
        },
      },
    });
    if (data.title) {
      await this.playlistRepository.update(playlist.id, data, 'title');
    } else {
      await this.playlistRepository.update(playlist.id, data);
    }
    return Response.success(
      null,
      'Playlist Updated Successfully',
      HttpStatus.CREATED,
    );
  }

  async publishPlaylist(userId: string, playlistId: string) {
    const playlist = await this.playlistRepository.findOneData({
      options: {
        where: {
          user_id: userId,
          id: playlistId,
        },
      },
    });

    await this.playlistRepository.update(playlist.id, { is_published: true });
    return Response.success(
      null,
      'Playlist Updated Successfully',
      HttpStatus.CREATED,
    );
  }

  async getPlaylists(query: QueryOptionsDto) {
    const { keywords, limit, page } = query;

    const data = await this.playlistRepository.paginatedFind({
      options: {
        where: {
          is_published: true,
        },
        relations: {
          user: true,
        },
        order: { created_at: 'DESC' },
      },
      search: keywords,
      searchKey: SearchKey.TITLE,
      page,
      limit,
    });

    return Response.success(
      data,
      'Playlists retrieved successfully',
      HttpStatus.OK,
    );
  }

  async getMyPlaylists(userId: string, query: QueryOptionsDto) {
    const { keywords, limit, page } = query;

    const result = await this.playlistRepository.paginatedFind({
      options: {
        where: {
          user_id: userId,
          is_published: true,
        },
        relations: {
          user: true,
          playlist_tracks: true,
        },
        order: { created_at: 'DESC' },
      },
      search: keywords,
      searchKey: SearchKey.TITLE,
      page,
      limit,
    });

    return Response.success(
      result,
      'My Playlists retrieved successfully',
      HttpStatus.OK,
    );
  }

  async addRemovePlaylistTrack(userId: string, query: AddPlaylistTrackDto) {
    const { playlist_id, track_id } = query;
    const playlist = await this.playlistRepository.findOneData({
      options: {
        where: {
          id: playlist_id,
          user_id: userId,
        },
      },
    });

    const track = (
      await lastValueFrom(
        this.trackClient.send('get_track', { trackId: track_id }),
      )
    ).data as TrackEntity;

    const playlistTrack = await this.playlistTrackRepository.findOneData({
      bypassExistenceCheck: true,
      options: {
        where: {
          playlist_id,
          track_id: track.id,
        },
      },
    });

    if (playlistTrack) {
      await this.playlistTrackRepository.delete(playlistTrack.id);
      return Response.success(
        null,
        `Track "${track.title}" Successfully deleted from "${playlist.title}"`,
        HttpStatus.OK,
      );
    }

    await this.playlistTrackRepository.createWithoutUniqueCheck({
      playlist_id: playlist.id,
      track_id: track.id,
      user_id: userId,
    });

    return Response.success(
      null,
      `Track "${track.title}" Successfully added to "${playlist.title}"`,
      HttpStatus.OK,
    );
  }

  async removePlaylist(userId: string, playlistTrackId: string) {
    const playlist = await this.playlistRepository.findOneData({
      options: {
        where: {
          id: playlistTrackId,
          user_id: userId,
        },
      },
    });

    await this.playlistRepository.delete(playlist.id);

    return Response.success(
      null,
      `Playlist Deleted Successfully`,
      HttpStatus.OK,
    );
  }

  async getPlaylistTracks(playlistId: string, query: QueryOptionsDto) {
    const { limit, page } = query;
    const result = await this.playlistTrackRepository.paginatedFind({
      options: {
        where: {
          playlist_id: playlistId,
        },
        relations: {
          playlist: true,
        },
      },
      limit,
      page,
    });


    const results = await Promise.all(
      result.data.map(async (playlistTrack) => {
        const track = (
          await lastValueFrom(
            this.trackClient.send('get_track', {
              trackId: playlistTrack.track_id,
            }),
          )
        ).data as TrackEntity;

        return {
          ...playlistTrack,
          track,
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
      'Playlist Tracks Retrieved Successfully',
      HttpStatus.OK,
    );
  }
}
