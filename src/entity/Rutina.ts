import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { ManyToOne              } from "typeorm"
import { OneToMany              } from "typeorm"
import { Ejercicio              } from "./Ejercicio"
import { Usuario                } from "./Usuario"

@Entity({name : 'rutina'})
export class Rutina {

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

    @OneToMany(() => Ejercicio , (ejercicio) => ejercicio.rutina)
    ejercicio!: Ejercicio

    @ManyToOne(() => Usuario , (socio) => socio.rutina)
    socio!: Usuario

    @ManyToOne(() => Usuario , (profesor) => profesor.rutina)
    profesor!: Usuario

    
}
