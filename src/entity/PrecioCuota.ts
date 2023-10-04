import { Column, Double, OneToMany                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
///import { TipoEjercicio } from "./TipoEjercicio" //// ACA IMPORTAR EL EJERCICIO

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

}
