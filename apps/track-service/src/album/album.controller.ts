import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Get,
  Patch,
  UseInterceptors,
  Delete,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CurrentUser } from '@libs/common/common/decorator/current-user.decorator';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { MessagePattern } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('add-album')
  async addAlbum(
    @CurrentUser() user: UserEntity,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    return await this.albumService.addAlbum(user.id, createAlbumDto);
  }

  @Get('get-all-albums')
  async getAllAlbums(@Query() query: QueryOptionsDto) {
    return await this.albumService.getAllAlbums(query);
  }

  @Patch('update-album/:albumId')
  async updateAlbum(
    @CurrentUser() user: UserEntity,
    @Param('albumId') albumId: string,
    @Body() data: UpdateAlbumDto,
  ) {
    return await this.albumService.updateAlbum(user.id, albumId, data);
  }

  @Get('get-album/:albumId')
  @MessagePattern("get_album")
  async getAlbum(@Param('albumId') albumId: string) {
    return await this.albumService.getAlbum(albumId);
  }

  @Get('get-album-likes/:albumId')
  async getAlbumLikes(@Param('albumId') albumId: string) {
    return await this.albumService.getAlbumLikes(albumId);
  }

  @Put('like-unlike-album/:albumId')
  async likeUnlikeAlbum(
    @CurrentUser() user: UserEntity,
    @Param('albumId') albumId: string,
  ) {
    return await this.albumService.likeUnLikeAlbum(user.id, albumId);
  }

  @Delete('delete-album/:albumId')
  async deleteAlbum(
    @CurrentUser() user: UserEntity,
    @Param('albumId') albumId: string,
  ) {
    return await this.albumService.deleteAlbum(user.id, albumId);
  }
}
