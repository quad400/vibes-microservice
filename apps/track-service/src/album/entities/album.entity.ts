import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlbumLikeEntity } from './album-like.entity';
import { ArtistEntity } from 'apps/user-service/src/artist/entities/artist.entity';
import { AbstractEntity } from '@libs/common/entity/abstract.entity';
import { TrackEntity } from '../../track/entities/track.entity';

@Entity('albums')
export class AlbumEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({
    default:
      'https://res.cloudinary.com/dupox1iqn/image/upload/v1725275626/tv7o1nyoapzmlzc17ace.jpg',
  })
  image_url: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: false})
  artist_id: string;

  @Column({default: 0, type: "int"})
  album_likes_count: number

  @OneToMany(() => AlbumLikeEntity, (album_like) => album_like.album)
  likes: AlbumLikeEntity[];

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: TrackEntity[];
}
