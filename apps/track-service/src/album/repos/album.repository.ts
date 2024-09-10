import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { AlbumEntity } from "../entities/album.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


export class AlbumRepository extends AbstractRepository<AlbumEntity>{

    constructor(
        @InjectRepository(AlbumEntity)
        protected readonly albumRepo: Repository<AlbumEntity>
    ){
        super(albumRepo, "Album")
    }
}