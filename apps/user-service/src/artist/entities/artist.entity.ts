import { AbstractEntity } from '@libs/common/entity/abstract.entity';
import { GenreEnum } from '@libs/common/enums/genre.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { AlbumEntity } from 'apps/track-service/src/album/entities/album.entity';

@Entity('artists')
export class ArtistEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  stage_name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: GenreEnum })
  genre: GenreEnum;

  @Column({nullable: false})
  user_id: string;

  @OneToOne(() => UserEntity, (user) => user.artist, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

}
