import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TrackLikeEntity } from './track-like.entity';
import { PlayEntity } from './play.entity';
import { AlbumEntity } from '../../album/entities/album.entity';
import { AbstractEntity } from '@libs/common/entity/abstract.entity';
import { TrackType } from '@libs/common/enums/track.enum';

@Entity('tracks')
export class TrackEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  image_url: string;

  @Column()
  audio_url: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ name: 'album_id', nullable: true })
  album_id: string;

  @Column({nullable: false})
  artist_id: string

  @Column({enum: TrackType, default: TrackType.SINGLE})
  track_type: TrackType
  // @ManyToMany(() => PlaylistEntity, (playlist) => playlist.tracks)
  // playlists: PlaylistEntity[];

  @ManyToOne(() => AlbumEntity, (album) => album.tracks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'album_id' })
  album: AlbumEntity;

  @OneToMany(() => TrackLikeEntity, (trackLike) => trackLike.track, {
    eager: false,
  })
  likes: TrackLikeEntity[];

  @Column({default: 0, type: "int"})
  track_plays_count: number

  @Column({default: 0, type: "int"})
  track_likes_count: number

  @OneToMany(() => PlayEntity, (play) => play.track)
  plays: PlayEntity[];
}
