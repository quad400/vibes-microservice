import { AbstractEntity } from 'libs/entity/abstract.entity';
import { UserRole } from 'libs/enums/user.enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FollowEntity } from './user-follow.entity';
import { ArtistEntity } from '../../artist/entities/artist.entity';
import { FavouriteAlbumEntity } from './favourite-album.entity';

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

  @OneToMany(() => FollowEntity, (follow) => follow.following, { eager: false })
  followings: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower, { eager: false })
  followers: FollowEntity[];

  @OneToMany(() => FavouriteAlbumEntity, (favourite) => favourite.user, {
    eager: false,
  })
  album_favourites: FavouriteAlbumEntity[];

  @OneToOne(() => ArtistEntity, (artist) => artist.user)
  artist: ArtistEntity;
}
