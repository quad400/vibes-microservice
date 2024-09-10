import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { AbstractEntity } from "@libs/common/entity/abstract.entity";


@Entity("follows")
export class FollowEntity extends AbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name: "follower_id", nullable: false})
    follower_id: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({name: "follower_id"})
    follower: UserEntity

    @Column({name: "following_id", nullable: false})
    following_id: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({name: "following_id"})
    following: UserEntity
 }