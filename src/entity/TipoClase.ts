import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class TipoClase {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 50,
    })
    descripcion!: string

    @Column({
        type : "tinyint",
        unsigned : true 
    })
    cupo! : number
}
