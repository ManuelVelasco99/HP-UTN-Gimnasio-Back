import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { ManyToOne              } from "typeorm"
import { MaquinaElemento        } from "./MaquinaElemento"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity()
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
    })
    nombre!: string

    @Column({
        type : "tinytext",
        nullable: true,
    })
    descripcion!: string

    @ManyToOne(() => MaquinaElemento, (maquinaElemento) => maquinaElemento.tiposEjercicio)
    maquinaElemento!: MaquinaElemento | null

}