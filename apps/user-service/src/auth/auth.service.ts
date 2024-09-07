import { Config } from '@libs/common/config';
import { InjectQueue } from '@nestjs/bull';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Queue } from 'bull';
import { UserRepository } from '../user/repos/user.repository';
import * as bcrypt from 'bcrypt';
import { generateCode } from '@libs/common/utils';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RegenrateOtpDto,
  VerifyUserDto,
} from './dto/auth.dto';
import { Response } from '@libs/common/utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectQueue(Config.CREATE_USER_QUEUE)
    private readonly createUserQueue: Queue,

    private jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    const isUser = await this.findByEmail(data.email);
    if (isUser) {
      throw new BadRequestException('User already exists');
    }
    const salt = await bcrypt.genSalt(10);

    const code = generateCode();
    data.password = await bcrypt.hash(data.password, salt);
    const user = await this.userRepository.create(data, data.email);
    user.otp_code = code;
    user.otp_expired_date = new Date(Date.now() + 1000 * 60 * 1);

    await this.userRepository.save(user);
    await this.createUserQueue.add(
      { code, user },
      { removeOnComplete: true, removeOnFail: true },
    );
    return Response.success(
      null,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  async login(data: LoginUserDto) {
    const user = await this.findByEmailWithSelect(data.email);
    console.log(user.is_verified);
    if (!user.is_verified) {
      throw new BadRequestException('Account not verified');
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    delete user.password;
    const token = this.jwtService.sign({ sub: user });
    return Response.success({ user, token }, 'Login successful', HttpStatus.OK);
  }

  async verify(data: VerifyUserDto) {
    const user = await this.findByEmailWithSelect(data.email);

    if (user.otp_expired_date < new Date()) {
      throw new BadRequestException('Otp code has expired');
    }
    if (user.otp_code !== data.code) {
      throw new BadRequestException('Invalid otp code');
    }
    if (data.type === 'REGISTER') {
      user.is_verified = true;
    }
    user.otp_code = null;
    user.otp_expired_date = null;
    await this.userRepository.save(user);

    delete user.password;
    const token = this.jwtService.sign({ sub: user });

    return Response.success(
      { user, token },
      'Verification successful',
      HttpStatus.OK,
    );
  }

  async regenerate(data: RegenrateOtpDto) {
    const user = await this.findByEmailWithSelect(data.email);

    const code = generateCode();
    user.otp_code = code;
    user.otp_expired_date = new Date(Date.now() + 1000 * 60 * 1);

    await this.userRepository.save(user);

    await this.createUserQueue.add(
      { code, user },
      { removeOnComplete: true, removeOnFail: true },
    );

    return Response.success(
      null,
      'Otp code generated successfully',
      HttpStatus.OK,
    );
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.findByEmailWithSelect(data.email);

    if (data.password !== data.confirm_password) {
      throw new BadRequestException('Password Mismatch');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(data.password, salt);
    await this.userRepository.save(user);

    return Response.success(
      null,
      'Password changed successfully',
      HttpStatus.OK,
    );
  }

  async findByEmailWithSelect(email: string) {
    let user = await this.userRepo
      .createQueryBuilder('users')
      .addSelect('users.password')
      .addSelect('users.otp_code')
      .addSelect('users.otp_expired_date')
      .where('users.email=:email', { email })
      .getOne();

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneData(email);
  }
}
