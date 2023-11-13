import { Column,                } from "typeorm"
import { Double                 } from "typeorm"
import { OneToMany              } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { CuotaMensual           } from "./CuotaMensual"

@Entity({name : 'precio_cuota'})
export class PrecioCuota {

    @PrimaryGeneratedColumn() 
    id!: number

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    monto!: Double 

    @Column({
        type:"date"
    })

    fecha_desde! : Date

    @Column()
    estado! : boolean

    @OneToMany(() => CuotaMensual , (cuota_mensual) => cuota_mensual.socio)
    cuotas_mensuales!: CuotaMensual[] | null

}
