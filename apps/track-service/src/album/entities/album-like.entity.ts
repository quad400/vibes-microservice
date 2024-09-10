import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AlbumEntity } from "./album.entity";
import { UserEntity } from "apps/user-service/src/user/entities/user.entity";
import { AbstractEntity } from "@libs/common/entity/abstract.entity";

@Entity("album_likes")
export class AlbumLikeEntity extends AbstractEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable: false})
    user_id: string
    
    @ManyToOne(()=> AlbumEntity, (album)=> album.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "album_id"})
    album: AlbumEntity

}