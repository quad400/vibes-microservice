import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export abstract class AbstractEntity {
    
    @Column({default: false})
    is_deleted: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}