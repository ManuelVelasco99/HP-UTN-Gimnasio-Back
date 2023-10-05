import { Column, Double                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity()
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

    //@ManyToOne(() => Ejercicio, (ejercicio) => ejercicio.nota)
    //ejercicio!: Ejercicio

}
