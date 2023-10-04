import { Column, OneToMany                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
///import { TipoEjercicio } from "./TipoEjercicio" //// ACA IMPORTAR EL EJERCICIO

@Entity({name : 'rutina_preset'})
export class RutinaPreset {

    @PrimaryGeneratedColumn() 
    id!: number

    @Column({
        length: 40,
    })
    nombre!: string 

    @Column({
        type:"date"
    })
    fecha_creacion! : Date

}
