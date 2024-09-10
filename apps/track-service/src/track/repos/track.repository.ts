import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TrackEntity } from "../entities/track.entity";


export class TrackRepository extends AbstractRepository<TrackEntity>{

    constructor(
        @InjectRepository(TrackEntity)
        protected readonly trackRepo: Repository<TrackEntity>
    ){
        super(trackRepo)
    }
}