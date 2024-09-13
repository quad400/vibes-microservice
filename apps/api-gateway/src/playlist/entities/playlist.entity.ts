import { AbstractEntity } from '@libs/common/entity/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistTrackEntity } from './playlist-track.entity';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';

@Entity('playlists')
export class PlaylistEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: false })
  is_published: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(()=> UserEntity, (user)=> user.playlists, {eager: true})
  @JoinColumn({name: "user_id"})
  user: UserEntity

  @OneToMany(() => PlaylistTrackEntity, (playlist_track) => playlist_track.playlist)
  playlist_tracks: PlaylistTrackEntity[];

}
