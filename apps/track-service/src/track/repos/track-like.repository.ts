import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TrackLikeEntity } from "../entities/track-like.entity";


export class TrackLikeRepository extends AbstractRepository<TrackLikeEntity>{

    constructor(
        @InjectRepository(TrackLikeEntity)
        protected readonly trackLikeRepo: Repository<TrackLikeEntity>
    ){
        super(trackLikeRepo)
    }
}