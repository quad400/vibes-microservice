import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './repos/user.repository';
import { Response } from 'libs/utils/response';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowRepository } from './repos/follow.repository';
import { FollowEntity } from './entities/user-follow.entity';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { lastValueFrom } from 'rxjs';
import { Config } from '@libs/common/config';
import { ClientProxy } from '@nestjs/microservices';
import { AlbumEntity } from 'apps/track-service/src/album/entities/album.entity';
import { FavouriteAlbumRepository } from './repos/favourite-album.repository';
import { FavouriteTrackRepository } from './repos/favourite-track.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly favouriteAlbumRepository: FavouriteAlbumRepository,
    private readonly favouriteTrackRepository: FavouriteTrackRepository,

    @Inject(Config.TRACK_SERVICE) private trackClient: ClientProxy,
  ) {}

  async updateMe(data: UpdateUserDto, userId: string) {
    const updatedUser = await this.userRepository.update(userId, data);
    return Response.success(
      updatedUser,
      'User updated successfully',
      HttpStatus.OK,
    );
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne(userId);
    return Response.success(user, 'User successfull get', HttpStatus.OK);
  }

  async followUnfollowUser(userId: string, followId: string) {
    const existingFollow = await this.followRepository.findOneData({
      data: {
        follower_id: userId,
        following_id: followId,
      },
      bypassExistenceCheck: true,
    });

    if (existingFollow) {
      await this.followRepository.delete(existingFollow.id);
      return Response.success(
        null,
        'User unfollowed successfully',
        HttpStatus.OK,
      );
    } else {
      const follower = await this.userRepository.findOne(userId);
      const following = await this.userRepository.findOne(followId);

      await this.followRepository.create({ follower, following });

      return Response.success(
        null,
        'User followed successfully',
        HttpStatus.OK,
      );
    }
  }

  async getFollowers(userId: string, query: QueryOptionsDto) {
    const { page, limit } = query;
    const followers = await this.followRepository.paginatedFind({
      options: {
        where: {
          following_id: userId,
        },
        relations: ['follower'],
      },
      page: page,
      limit: limit,
    });
    return Response.success(
      followers,
      'Followers fetched successfully',
      HttpStatus.OK,
    );
  }

  async getFollowings(userId: string, query: QueryOptionsDto) {
    const { page, limit } = query;
    const followings = await this.followRepository.paginatedFind({
      options: {
        where: {
          follower_id: userId,
        },
        relations: ['following'],
      },
      page: page,
      limit: limit,
    });
    return Response.success(
      followings,
      'Following fetched successfully',
      HttpStatus.OK,
    );
  }

  async addOrRemoveFavouriteAlbum(userId: string, albumId: string) {
    const user = await this.userRepository.findOne(userId);

    const albumData = (await lastValueFrom(
      this.trackClient.send('get_album', { albumId }),
    ));

    const album = albumData.data as AlbumEntity

    const data = {
      user_id: user.id,
      album_id: album.id,
    };
    const albumFavExist = await this.favouriteAlbumRepository.findOneData({
      data,
      bypassExistenceCheck: true
    });

    if (albumFavExist) {
      await this.favouriteAlbumRepository.delete(albumFavExist.id);
      return Response.success(
        null,
        'Album successfully removed from favourites',
        HttpStatus.OK,
      );
    } else {
      await this.favouriteAlbumRepository.create(data);
      return Response.success(
        null,
        'Album successfully added to favourites',
        HttpStatus.OK,
      );
    }
  }

  async getAlbumFavourites(userId: string, query: QueryOptionsDto) {
    const { limit, page } = query;

    const result = await this.favouriteAlbumRepository.paginatedFind({
      options: {
        where: {
          user_id: userId,
        },
      },
      page,
      limit,
    });

    const results = await Promise.all(
      result.data.map(async (albumFav) => {
        const album = (await lastValueFrom(
          this.trackClient.send('get_album', { albumId: albumFav.id }),
        ));

        // Combine album with artist details
        return {
          ...albumFav,
          album,
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
      'Favourite List retrieved successfully',
      HttpStatus.OK,
    );
  }

  async addOrRemoveFavouriteTrack(userId: string, trackId: string) {

    const trackData = (await lastValueFrom(
      this.trackClient.send('get_track', { trackId }),
    ));

    const track = trackData.data as AlbumEntity

    const data = {
      user_id: userId,
      track_id: track.id,
    };
    const trackFavExist = await this.favouriteTrackRepository.findOneData({
      data,
      bypassExistenceCheck: true
    });

    if (trackFavExist) {
      await this.favouriteTrackRepository.delete(trackFavExist.id);
      return Response.success(
        null,
        'Track successfully removed from favourites',
        HttpStatus.OK,
      );
    } else {
      await this.favouriteTrackRepository.create(data);
      return Response.success(
        null,
        'Track successfully added to favourites',
        HttpStatus.OK,
      );
    }
  }

  async getTrackFavourites(userId: string, query: QueryOptionsDto) {
    const { limit, page } = query;

    const result = await this.favouriteTrackRepository.paginatedFind({
      options: {
        where: {
          user_id: userId,
        },
      },
      page,
      limit,
    });

    const results = await Promise.all(
      result.data.map(async (trackFav) => {
        const track = (await lastValueFrom(
          this.trackClient.send('get_track', { albumId: trackFav.id }),
        ));

        // Combine album with artist details
        return {
          ...trackFav,
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
      'Favourite List retrieved successfully',
      HttpStatus.OK,
    );
  }
}
