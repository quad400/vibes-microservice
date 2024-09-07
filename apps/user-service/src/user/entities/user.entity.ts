import { AbstractEntity } from 'libs/entity/abstract.entity';
import { UserRole } from 'libs/enums/user.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ enum: UserRole, default: UserRole.LISTENER })
  role: UserRole;

  @Column({ select: false })
  password: string;

  @Column({
    default:
      'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
  })
  avatar: string;

  @Column({ nullable: true, select: false })
  otp_expired_date: Date;

  @Column({ nullable: true, select: false })
  otp_code: string;

  @Column({ type: 'jsonb', nullable: true })
  socials: object;

  @Column({ default: false })
  is_verified: boolean;
}
