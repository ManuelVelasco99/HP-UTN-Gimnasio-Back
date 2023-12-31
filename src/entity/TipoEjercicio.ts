import { Column, OneToMany                 } from "typeorm"
import { Entity                 } from "typeorm"
import { ManyToOne              } from "typeorm"
import { MaquinaElemento        } from "./MaquinaElemento"
import { PrimaryGeneratedColumn } from "typeorm"
import { Ejercicio              } from "./Ejercicio"

@Entity({name : 'tipo_ejercicio'})
export class TipoEjercicio {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type : "tinytext",
        nullable: true,
    })
    multimedia!: string

    @Column({
        length: 40,
        nullable : true
    })
    nombre!: string

    @Column({
        length: 1000,
        nullable : true
    })
    descripcion!: string

    @ManyToOne(() => MaquinaElemento, (maquinaElemento) => maquinaElemento.tiposEjercicio)
    maquinaElemento!: MaquinaElemento | null

    @OneToMany(() => Ejercicio, (ejercicio) => ejercicio.tiposEjercicio)
    ejercicio!: Ejercicio[] | null
}
