import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repos/user.repository';
import { Response } from 'libs/utils/response';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async updateMe(data: UpdateUserDto, user: UserEntity) {
    Object.assign(user, data);
    const updatedUser = await this.userRepository.save(user);
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

}
