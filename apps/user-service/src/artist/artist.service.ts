import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { ArtistRepository } from './repos/artist.repository';
import { CreateArtistDto, UpdateArtistDto } from './dtos/artist.dto';
import { UserRepository } from '../user/repos/user.repository';
import { UserRole } from '@libs/common/enums/user.enum';
import { Response } from '@libs/common/utils/response';
import { QueryOptionsDto } from '@libs/common/utils/pagination';

@Injectable()
export class ArtistService {
  constructor(
    private readonly artistRepository: ArtistRepository,

    private readonly userRepository: UserRepository,
  ) {}

  async createArtist(userId: string, data: CreateArtistDto) {
    const existedArtist = await this.artistRepository.findOneData({
      data: {
        user_id: userId,
      },
      bypassExistenceCheck: true,
    });

    if (existedArtist) {
      throw new ConflictException('Artist already exists');
    }

    const body = { user_id: userId, ...data };

    await this.userRepository.update(userId, { role: UserRole.ARTIST });

    await this.artistRepository.create(body, 'stage_name');

    return Response.success(
      null,
      'Artist created successfully',
      HttpStatus.CREATED,
    );
  }

  async updateArtist(userId: string, data: UpdateArtistDto) {
    const artist = await this.artistRepository.findOneData({
      data: { user_id: userId },
    });

    await this.artistRepository.update(artist.id, data, 'stage_name');

    return Response.success(null, 'Artist updated successfully', HttpStatus.OK);
  }

  async getArtist(artistId: string) {
    const artist = await this.artistRepository.findOne(artistId, {
      relations: ['user'],
    });

    return Response.success(artist, 'Artist get successfully', HttpStatus.OK);
  }

  async getArtistById(artistId: string) {
    const artist = await this.artistRepository.findOne(artistId, {
      relations: ['user'],
    });

    return artist;
  }

  async getArtistByUserId(userId: string){
    const artist = await this.artistRepository.findOneData({
      data: {
        user_id: userId
      }
    })
    return artist
  }

  async deleteArtist(userId: string) {
    const artist = await this.artistRepository.findOneData({
      data: { user: { id: userId } },
    });

    await this.artistRepository.softDelete(artist.id);

    return Response.success(
      null,
      'Artist Account deleted successfully',
      HttpStatus.OK,
    );
  }

  async getArtists(query: QueryOptionsDto) {
    const { limit, keywords, page } = query;

    const pagedto = await this.artistRepository.paginatedFind({
      options: {
        relations: ['user'],
        order: { created_at: 'DESC' },
      },
      page,
      limit,
      search: keywords,
    });

    return Response.success(pagedto, 'Artists get Successfully', HttpStatus.OK);
  }

  async restoreArtist(userId: string) {
    console.log(userId);
    const artist = await this.artistRepository.findOneWithoutDeleteCheck({
      data: { user_id: userId },
    });

    console.log(artist);
    await this.artistRepository.restore(artist.id);

    return Response.success(
      null,
      'Artist Account restored successfully',
      HttpStatus.OK,
    );
  }
}
