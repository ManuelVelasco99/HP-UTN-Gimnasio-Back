import { Column, OneToMany                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { TipoEjercicio } from "./TipoEjercicio"

@Entity({name : 'maquina_elemento'})
export class MaquinaElemento {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 40,
    })
    descripcion!: string

    @Column()
    estado! : boolean

    @OneToMany(() => TipoEjercicio, (tipoEjercicio) => tipoEjercicio.maquinaElemento)
    tiposEjercicio! : TipoEjercicio[] | null

}
