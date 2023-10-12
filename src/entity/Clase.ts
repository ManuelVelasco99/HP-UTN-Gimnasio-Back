import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { ManyToOne, OneToMany   } from "typeorm"
import { TipoClase        } from "./TipoClase"
import { Usuario        } from "./Usuario"
import { SocioClase        } from "./SocioClase"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Clase {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type : "date",
    })
    fecha!: Date

    @Column({
        type : "time",
    })
    horario_inicio!: string

    @Column({
        type : "time",
    })
    horario_fin!: string

    @ManyToOne(() => TipoClase, (tipoClase) => tipoClase.clases)
    tipoClase!: TipoClase | null

    @ManyToOne(() => Usuario, (usuario) => usuario.clases)
    usuario!: Usuario | null

    @OneToMany(() => SocioClase, (socioClase) => socioClase.clase)
    sociosClases! : SocioClase[] | null

}
