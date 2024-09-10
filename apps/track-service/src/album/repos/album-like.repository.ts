import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { AlbumLikeEntity } from "../entities/album-like.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


export class AlbumLikeRepository extends AbstractRepository<AlbumLikeEntity>{

    constructor(
        @InjectRepository(AlbumLikeEntity)
        protected readonly albumLikeRepo: Repository<AlbumLikeEntity>
    ){
        super(albumLikeRepo, "Album Like")
    }
}