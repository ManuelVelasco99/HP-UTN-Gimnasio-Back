import { Column, OneToMany                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Clase } from "./Clase"

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

    @OneToMany(() => Clase, (clase) => clase.tipoClase)
    clases! : Clase[] | null
}
