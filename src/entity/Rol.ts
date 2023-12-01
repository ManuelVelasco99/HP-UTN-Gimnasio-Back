import { Column, OneToMany      } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Usuario } from "./Usuario"

@Entity({name: 'rol'})
export class Rol {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 40,
    })
    nombre!: string

    @OneToMany( () => Usuario, (usuario) => usuario.rol )
    usuarios! : Usuario[] | null

}
