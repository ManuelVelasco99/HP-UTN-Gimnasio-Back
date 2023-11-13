import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { OneToMany              } from "typeorm"
import { Ejercicio              } from "./Ejercicio"
import { Usuario                } from "./Usuario"     
import { ManyToOne              } from "typeorm"

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

    @OneToMany(() => Ejercicio , (ejercicio) => ejercicio.rutinaPreset)
    ejercicio!: Ejercicio[]  | null

    @ManyToOne(() => Usuario , (profesor) => profesor.rutina_preset_profesor)
    profesor!: Usuario | null


    
}
