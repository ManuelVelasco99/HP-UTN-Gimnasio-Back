import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Double                 } from "typeorm"
import { ManyToOne              } from "typeorm"
import { Ejercicio              } from "./Ejercicio"


@Entity({name : 'nota'})
export class Nota {

    @PrimaryGeneratedColumn()
    id!: number


    @Column({
        type : "date",
    })
    fecha!: Date

    
    @Column({
        type : "decimal",
        precision: 5, 
        scale: 2
    })
    peso!: Double


    @Column({
        type : "tinytext",
    })
    comentario!: string

    @ManyToOne(() => Ejercicio, (ejercicio) => ejercicio.notas)
    ejercicio!: Ejercicio

}
