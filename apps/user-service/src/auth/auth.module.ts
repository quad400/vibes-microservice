import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@libs/common/config';
import { BullModule } from '@nestjs/bull';
import { UserRepository } from '../user/repos/user.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: Config.JWT_EXPIRES_IN },
    }),
    BullModule.registerQueue({
      name: Config.CREATE_USER_QUEUE
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
