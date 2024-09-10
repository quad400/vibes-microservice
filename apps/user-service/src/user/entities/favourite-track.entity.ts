import { AbstractEntity } from "@libs/common/entity/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity("favourite_tracks")
export class FavouriteTrackEntity extends AbstractEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    user_id: string

    @Column({nullable: false})
    track_id: string
    
    @ManyToOne(()=> UserEntity, (user)=> user.track_favourites, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: UserEntity
}