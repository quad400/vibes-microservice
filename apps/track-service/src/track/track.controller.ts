import { Body, Controller, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { TrackService } from './track.service';
import { CurrentUser } from 'apps/user-service/src/user/decorator/current-user.decorator';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateTrackDto } from './dto/update-track.dto';


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

  // @Get('get-all-tracks')
  // async getAllTracks(@Query() query: QueryOptionsDto) {
  //   return await this.trackService.getAllTracks(query);
  // }


  
  // @Get('get-track/:trackId')
  // async getTrack(
  //   @CurrentUser() user: UserEntity,
  //   @Param('trackId') trackId: string,
  // ) {
  //   return await this.trackService.getTrack(user.id, trackId);
  // }

  // @Get('get-artist-track-plays')
  // async getArtistTrackPlays(
  //   @Query() query: GetArtistTrackPlaysDto,
  // ) {
  //   return await this.trackService.getArtistTrackPlays(query);
  // }


  // @Get('get-track-plays/:trackId')
  // async getTrackPlays(@Param('trackId') trackId: string) {
  //   return await this.trackService.getTrackPlays(trackId);
  // }

  // @Get('get-track-likes/:trackId')
  // async getAlbumLikes(@Param('trackId') trackId: string) {
  //   return await this.trackService.getTrackLikes(trackId);
  // }

  // @Put('like-unlike-track/:trackId')
  // async likeUnlikeAlbum(
  //   @CurrentUser() user: UserEntity,
  //   @Param('trackId') trackId: string,
  // ) {
  //   return await this.trackService.likeUnLikeTrack(user.id, trackId);
  // }


  // @Put('add-remove-favourite-track/:trackId')
  // async addRemoveFavouriteTrack(
  //   @CurrentUser() user: UserEntity,
  //   @Param('trackId') trackId: string,
  // ) {
  //   return await this.trackService.addRemoveFavouriteTrack(user.id, trackId);
  // }

  // @Delete('delete-track/:trackId')
  // async deleteTrack(
  //   @CurrentUser() user: UserEntity,
  //   @Param('trackId') trackId: string,
  // ) {
  //   return await this.trackService.deleteTrack(user.id, trackId);
  // }

}
