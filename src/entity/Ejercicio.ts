import { Column                 } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { ManyToOne              } from "typeorm"
import { OneToMany              } from "typeorm"
import { TipoEjercicio          } from "./TipoEjercicio"
import { Nota                   } from "./Nota"
import { RutinaPreset           } from "./RutinaPreset"
//import { Rutina                 } from "./RutinaPreset"

@Entity({name : 'ejercicio'})
export class Ejercicio {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 10,
    })
    repeticiones!: string

    @Column({
        type : "int",
        unsigned : true 
    })
    diaRutina! : number

    @Column({
        type : "tinyint",
        unsigned : true 
    })
    series! : number
    

    @ManyToOne(() => TipoEjercicio , (tiposEjercicio) => tiposEjercicio.ejercicio)
    tiposEjercicio!: TipoEjercicio

    @OneToMany(() => Nota , (nota) => nota.ejercicio)
    nota!: Nota | null

    @ManyToOne(() => RutinaPreset , (rutinaPreset) => rutinaPreset.ejercicio)
    rutinaPreset!: RutinaPreset | null

    //@ManyToOne(() => Rutina , (rutina) => rutina.ejercicio)
    //rutina!: Rutina | null

}
