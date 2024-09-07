import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { DatabaseModule } from '@libs/common/common/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DatabaseModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class UserServiceModule {}
