import { AbstractEntity } from '@libs/common/entity/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';

@Entity('playlist_tracks')
export class PlaylistTrackEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @Column({ nullable: false })
  track_id: string;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.playlist_tracks)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  
  @Column({ nullable: false })
  playlist_id: string;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.playlist_tracks, {onDelete: "CASCADE"})
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;
}
