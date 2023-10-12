import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { ManyToOne              } from "typeorm"
import { Clase        } from "./Clase"
import { Usuario        } from "./Usuario"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class SocioClase {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type : "date",
    })
    fecha_inscripcion!: Date

    @Column()
    asistencia!: boolean

    @ManyToOne(() => Clase, (Clase) => Clase.sociosClases)
    clase!: Clase | null

    @ManyToOne(() => Usuario, (usuario) => usuario.clases)
    usuario!: Usuario | null

}