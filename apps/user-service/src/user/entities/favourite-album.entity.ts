import { AbstractEntity } from "@libs/common/entity/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity("favourite_albums")
export class FavouriteAlbumEntity extends AbstractEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    user_id: string

    @Column({nullable: false})
    album_id: string
    
    @ManyToOne(()=> UserEntity, (user)=> user.album_favourites, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: UserEntity
}