import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Rol {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 40,
    })
    nombre!: string
}
