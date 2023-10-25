import { Column                 } from "typeorm"
import { ManyToOne              } from "typeorm"
import { OneToMany              } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Rol                    } from "./Rol"
import { Rutina                 } from "./Rutina"
import { Clase } from "./Clase"

@Entity({name : 'usuario'})
export class Usuario {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 128,
    })
    contrasenia!: string

    @Column({
        length:128,
        unique:true
    })
    dni!: string
    
    @Column({length:40})
        nombre!: string

    @Column({length:40})
        apellido!: string

    @Column({length:40})
        telefono!: string    

    @Column({
        type:"date"
            })
    fecha_nacimiento! : Date
    
    @Column({
        type:"date"
            })
    fecha_comienzo! : Date 
    
    @Column({length:50})
        email!: string 
        
    @Column()
    estado! : boolean

    @ManyToOne( () => Rol, (rol) => rol.usuarios)
    rol!: Rol | null

    @OneToMany(() => Rutina , (rutina) => rutina.socio)
    rutina!: Rutina

    @OneToMany(() => Clase, (clase) => clase.usuario)
    clases! : Clase[] | null
}
