import { Column, ManyToOne      } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Rol } from "./Rol"

@Entity({name : 'usuario'})
export class Usuario {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 128,
    })
    contrasenia!: string

    @Column({length:128})
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



    

}
