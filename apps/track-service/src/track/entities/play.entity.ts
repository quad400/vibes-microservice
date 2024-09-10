import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AbstractEntity } from '@libs/common/entity/abstract.entity';

@Entity('play')
export class PlayEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;
  
  @Column({ nullable: false })
  track_id: string
  @ManyToOne(() => TrackEntity, (track) => track.plays)
  @JoinColumn({name: "track_id"})
  track: TrackEntity;
}
