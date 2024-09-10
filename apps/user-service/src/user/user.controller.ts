import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FollowUserDto, UpdateUserDto } from './dtos/user.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { MessagePattern, Payload } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update')
  async updateMe(@Body() data: UpdateUserDto, @CurrentUser() user: UserEntity) {
    return await this.userService.updateMe(data, user.id);
  }

  @Get('me')
  @MessagePattern('get_user')
  async getMe(
    @CurrentUser() user: UserEntity,
    @Payload() data: { userId: string },
  ) {
    return await this.userService.getMe(user.id);
  }

  @MessagePattern('get_user')
  async getUserByIdService(@Payload() data: { userId: string }) {
    return await this.userService.getMe(data.userId);
  }

  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: string) {
    return await this.userService.getMe(userId);
  }

  @Put('follow-unfollow/:followId')
  async followUser(
    @CurrentUser() user: UserEntity,
    @Param('followId') followId: string,
  ) {
    return await this.userService.followUnfollowUser(user.id, followId);
  }

  @Get('followers')
  async getFollowers(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.userService.getFollowers(user.id, query);
  }

  @Get('followings')
  async getFollowings(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.userService.getFollowings(user.id, query);
  }

  @Put('album-favourites/add-remove-album/:albumId')
  async addOrRemoveAlbumFavourite(
    @CurrentUser() user: UserEntity,
    @Param('albumId') albumId: string,
  ) {
    return await this.userService.addOrRemoveFavouriteAlbum(user.id, albumId);
  }

  @Get('album-favourites')
  async getAlbumFavourite(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.userService.getAlbumFavourites(user.id, query);
  }

  @Put('track-favourites/add-remove-track/:trackId')
  async addOrRemoveTrackFavourite(
    @CurrentUser() user: UserEntity,
    @Param('trackId') trackId: string,
  ) {
    return await this.userService.addOrRemoveFavouriteTrack(user.id, trackId);
  }

  @Get('track-favourites')
  async getTrackFavourite(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.userService.getTrackFavourites(user.id, query);
  }
}
