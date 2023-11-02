import { Column	      			} from "typeorm"
import { ManyToOne      		} from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Usuario                } from "./Usuario"
import { PrecioCuota            } from "./PrecioCuota"

@Entity({name : 'cuota_mensual'})
export class CuotaMensual {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type:"date"
    })
    fecha_periodo!: Date

    @Column({
        type:"date"
    })
    fecha_pago!: Date

    @Column({
        type:"tinytext",
        nullable: true,
    })
    motivo_baja!: string | null

    @Column()
    estado!: boolean

    @ManyToOne(() => Usuario, (socio) => socio.cuotas_mensuales)
    socio!: Usuario

    @ManyToOne(() => Usuario, (usuario_eliminacion) => usuario_eliminacion.cuotas_mensuales)
    usuario_eliminacion!: Usuario | null

    @ManyToOne(() => PrecioCuota, (precio_cuota) => precio_cuota.cuotas_mensuales)
    precio_cuota!: PrecioCuota


}
