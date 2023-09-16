import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

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

}
