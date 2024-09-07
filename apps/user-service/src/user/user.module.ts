import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repos/user.repository';
import { Repository } from 'typeorm';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
