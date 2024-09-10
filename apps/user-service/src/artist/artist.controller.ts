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
import { ArtistService } from './artist.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CurrentUser } from '../user/decorator/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { QueryOptionsDto } from '@libs/common/utils/pagination';
import { CreateArtistDto, UpdateArtistDto } from './dtos/artist.dto';
import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';

@UseInterceptors(CacheInterceptor)
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post('create')
  async createArtist(
    @CurrentUser() user: UserEntity,
    @Body() data: CreateArtistDto,
  ) {
    return await this.artistService.createArtist(user.id, data);
  }

  @MessagePattern("get_artist")
  async getArtistByUserId(@Payload() data: {userId: string}, @Ctx() context: RedisContext){
   return await this.artistService.getArtistByUserId(data.userId)
  }

  @MessagePattern("get_artist_by_id")
  async getArtistById(@Payload() data: {id: string}, @Ctx() context: RedisContext){
   return await this.artistService.getArtistById(data.id)
  }

  @Patch('update')
  async updateArtist(
    @CurrentUser() user: UserEntity,
    @Body() data: UpdateArtistDto,
  ) {
    return await this.artistService.updateArtist(user.id, data);
  }

  @Get('get-artists')
  async getArtists(@Query() query: QueryOptionsDto) {
    return await this.artistService.getArtists(query);
  }

  @Get(':artistId')
  async getArtist(@Param('artistId') artistId: string) {
    return await this.artistService.getArtist(artistId);
  }

  @Delete('delete-artist-account')
  async deleteArtistAccount(@CurrentUser() user: UserEntity) {
    return await this.artistService.deleteArtist(user.id);
  }

  @Put("restore-artist-account")
  async restoreArtistAccount(@CurrentUser() user: UserEntity) {
    return await this.artistService.restoreArtist(user.id);
  }
}
