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
import { PlaylistService } from './playlist.service';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  UpdatePlaylistDto,
} from './dto/playlist.dto';
import { CurrentUser } from '@libs/common/common/decorator/current-user.decorator';
import { QueryOptionsDto } from '@libs/common/utils/pagination';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post('create-new-playlist')
  async createPlaylist(
    @CurrentUser() user: UserEntity,
    @Body() data: CreatePlaylistDto,
  ) {
    return await this.playlistService.createPlaylist(user.id, data);
  }

  @Get('get-all-playlists')
  async getPlaylists(@Query() query: QueryOptionsDto) {
    return await this.playlistService.getPlaylists(query);
  }

  @Put('publish-playlist/:playlistId')
  async publishPlaylist(
    @CurrentUser() user: UserEntity,
    @Param('playlistId') playlistId: string,
  ) {
    return await this.playlistService.publishPlaylist(user.id, playlistId);
  }

  @Get('get-playlist/:playlistId')
  async getPlaylist(@Param('playlistId') playlistId: string) {
    return await this.playlistService.getPlaylist(playlistId);
  }

  @Get('get-user-playlists')
  async getUserPlaylists(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.playlistService.getMyPlaylists(user.id, query);
  }

  @Patch('update-playlist/:playlistId')
  async updatePlaylist(
    @CurrentUser() user: UserEntity,
    @Param('playlistId') playlistId: string,
    @Body() data: UpdatePlaylistDto,
  ) {
    return await this.playlistService.updatePlaylist(user.id, playlistId, data);
  }

  @Put('add-remove-playlist-track')
  async addRemoveTrackPlaylist(
    @CurrentUser() user: UserEntity,
    @Query() query: AddPlaylistTrackDto,
  ) {
    return await this.playlistService.addRemovePlaylistTrack(user.id, query);
  }

  @Get('get-playlist/:playlistId/tracks')
  async getPlaylistTracks(
    @Param('playlistId') playlistId: string,
    @Query() query: QueryOptionsDto,
  ) {
    return await this.playlistService.getPlaylistTracks(playlistId, query);
  }

  @Delete('remove-playlist/:playlistId')
  async removePlaylist(
    @CurrentUser() user: UserEntity,
    @Param('playlistId') playlistId: string,
  ) {
    return await this.playlistService.removePlaylist(user.id, playlistId);
  }
}
