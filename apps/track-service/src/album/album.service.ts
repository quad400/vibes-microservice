import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { AlbumRepository } from './repos/album.repository';
import { AlbumLikeRepository } from './repos/album-like.repository';
import { Config } from '@libs/common/config';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Response } from '@libs/common/utils/response';
import { ArtistEntity } from 'apps/user-service/src/artist/entities/artist.entity';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly albumLikeRepository: AlbumLikeRepository,

    @Inject(Config.USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async addAlbum(userId: string, data: CreateAlbumDto) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist', { userId }),
    )) as ArtistEntity;

    const body = { artist_id: artist.id, ...data };

    await this.albumRepository.create(body, 'title');

    return Response.success(
      null,
      'Album created successfully',
      HttpStatus.CREATED,
    );
  }

  async updateAlbum(userId: string, albumId: string, data: UpdateAlbumDto) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist', { userId }),
    )) as ArtistEntity;

    const album = await this.albumRepository.findOneData({
      options: {
        where: {
          id: albumId,
          artist_id: artist.id,
        },
      },
    });

    await this.albumRepository.update(album.id, data);
    return Response.success(null, 'Album updated successfully', HttpStatus.OK);
  }

  async getAlbum(albumId: string) {
    const album = await this.albumRepository.findOne(albumId, {
      // relations: ['tracks'],
    });
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist_by_id', { artistId: album.artist_id }),
    )) as ArtistEntity;

    return Response.success(
      { ...album, artist },
      'Album retrieved successfully',
      HttpStatus.OK,
    );
  }

  async getAllAlbums(query: QueryOptionsDto) {
    const { limit, keywords, page } = query;

    const result = await this.albumRepository.paginatedFind({
      options: {
        // relations: ['tracks'],
        order: { created_at: 'DESC' },
      },
      page,
      limit,
      search: keywords,
    });

    const results = await Promise.all(
      result.data.map(async (album) => {
        const artist = (await lastValueFrom(
          this.userClient.send('get_artist_by_id', { artistId: album.id }),
        )) as ArtistEntity;

        // Combine album with artist details
        return {
          ...album,
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
      'Album retrieved Successfully',
      HttpStatus.OK,
    );
  }

  async likeUnLikeAlbum(userId: string, albumId: string) {
    const album = await this.albumRepository.findOne(albumId);

    const existingLike = await this.albumLikeRepository.findOneData({
      options: {
        where: {
          user_id: userId,
          album: { id: album.id },
        },
      },
      bypassExistenceCheck: true,
    });

    if (existingLike) {
      await this.albumLikeRepository.delete(existingLike.id);
      await this.albumRepository.update(album.id, {
        album_likes_count: album.album_likes_count - 1,
      });
      return Response.success(
        null,
        'Album unliked successfully',
        HttpStatus.OK,
      );
    } else {
      const album = await this.albumRepository.findOne(albumId);
      await this.albumRepository.update(album.id, {
        album_likes_count: album.album_likes_count + 1,
      });

      this.albumLikeRepository.create({
        user_id: userId,
        album: { id: album.id },
      });
      return Response.success(null, 'Album liked successfully', HttpStatus.OK);
    }
  }

  async getAlbumLikes(albumId: string) {
    const albumLikes = await this.albumLikeRepository.findAll({
      options: {
        where: { album: { id: albumId } },
        // relations: ['user'],
      },
    });

    const result = await Promise.all(
      albumLikes.map(async (albumLikes) => {
        const user = (await lastValueFrom(
          this.userClient.send('get_user', { userId: albumLikes.user_id }),
        )) as UserEntity;

        // Combine albumLikes with artist details
        return {
          ...albumLikes,
          user,
        };
      }),
    );

    return Response.success(
      result,
      'Album likes retrieved successfully',
      HttpStatus.OK,
    );
  }

  async deleteAlbum(userId: string, albumId: string) {
    const artist = (await lastValueFrom(
      this.userClient.send('get_artist_by_id', { albumId }),
    )) as ArtistEntity;

    const album = await this.albumRepository.findOneData({
      options: {
        where: {
          id: albumId,
          artist_id: artist.id,
        },
      },
    });

    await this.albumRepository.softDelete(album.id);

    return Response.success(null, 'Album deleted successfully', HttpStatus.OK);
  }
}
