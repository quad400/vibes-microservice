import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CurrentUser } from '@libs/common/common/decorator/current-user.decorator';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import { CreateTrackDto, GetArtistTrackPlaysDto } from './dto/create-track.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateTrackDto } from './dto/update-track.dto';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { MessagePattern, Payload } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('add-track')
  async addNewTrack(
    @CurrentUser() user: UserEntity,
    @Body() data: CreateTrackDto,
  ) {
    return await this.trackService.addTrack(user.id, data);
  }

  @Patch('update-track/:trackId')
  async updateTrack(
    @CurrentUser() user: UserEntity,
    @Param('trackId') trackId: string,
    @Body() data: UpdateTrackDto,
  ) {
    return await this.trackService.updateTrack(user.id, trackId, data);
  }

  @Get('get-all-tracks')
  async getAllTracks(@Query() query: QueryOptionsDto) {
    return await this.trackService.getAllTracks(query);
  }

  @Get('get-track/:trackId')
  async getTrack(
    @CurrentUser() user: UserEntity,
    @Param('trackId') trackId: string,
  ) {
    return await this.trackService.getTrack({ userId: user.id, trackId });
  }

  @MessagePattern('get_track')
  async getTrackMessage(@Payload() data: { trackId: string }) {
    return await this.trackService.getTrack({ trackId: data.trackId });
  }

  @Get('get-recently-played-tracks')
  async getRecentlyPlays(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.trackService.getRecentlyPlays(user.id, query);
  }

  @Get('get-track-likes/:trackId')
  async getAlbumLikes(
    @Param('trackId') trackId: string,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.trackService.getTrackLikes(trackId, query);
  }

  @Put('like-unlike-track/:trackId')
  async likeUnlikeAlbum(
    @CurrentUser() user: UserEntity,
    @Param('trackId') trackId: string,
  ) {
    return await this.trackService.likeUnLikeTrack(user.id, trackId);
  }

  // @Put('add-remove-favourite-track/:trackId')
  // async addRemoveFavouriteTrack(
  //   @CurrentUser() user: UserEntity,
  //   @Param('trackId') trackId: string,
  // ) {
  //   return await this.trackService.addRemoveFavouriteTrack(user.id, trackId);
  // }

  @Delete('delete-track/:trackId')
  async deleteTrack(
    @CurrentUser() user: UserEntity,
    @Param('trackId') trackId: string,
  ) {
    return await this.trackService.deleteTrack(user.id, trackId);
  }
}
