import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayEntity } from "../entities/play.entity";


export class PlayRepository extends AbstractRepository<PlayEntity>{

    constructor(
        @InjectRepository(PlayEntity)
        protected readonly playRepo: Repository<PlayEntity>
    ){
        super(playRepo)
    }
}