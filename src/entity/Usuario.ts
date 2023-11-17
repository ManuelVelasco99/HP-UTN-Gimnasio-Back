import { Column                 } from "typeorm"
import { ManyToOne              } from "typeorm"
import { OneToMany              } from "typeorm"
import { Entity                 } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Rol                    } from "./Rol"
import { Rutina                 } from "./Rutina"
import { Clase                  } from "./Clase"
import { CuotaMensual           } from "./CuotaMensual"
import { RutinaPreset           } from "./RutinaPreset"   


@Entity({name : 'usuario'})
export class Usuario {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 128,
    })
    contrasenia!: string

    @Column({
        length:128,
        unique:true
    })
    dni!: string
    
    @Column({length:40})
        nombre!: string

    @Column({length:40})
        apellido!: string

    @Column({length:40})
        telefono!: string    

    @Column({
        type:"date"
            })
    fecha_nacimiento! : Date
    
    @Column({
        type:"date"
            })
    fecha_comienzo! : Date 
    
    @Column({length:50})
        email!: string 
        
    @Column()
    estado! : boolean

    @Column({type:"varchar",length:128, nullable: true, default: null})
    codigo_restablecimiento: string | null = null;

    @ManyToOne( () => Rol, (rol) => rol.usuarios,{ nullable: false })
    rol!: Rol | null

    @OneToMany(() => Rutina , (rutina) => rutina.socio)
    rutina!: Rutina

    @OneToMany(() => Rutina , (rutina) => rutina.profesor)
    rutina_profesor!: Rutina
    
    @OneToMany(() => RutinaPreset , (rutina_preset) => rutina_preset.profesor)
    rutina_preset_profesor!: RutinaPreset

    @OneToMany(() => Clase, (clase) => clase.usuario)
    clases! : Clase[] | null

    @OneToMany(() => CuotaMensual , (cuota_mensual) => cuota_mensual.socio)
    cuotas_mensuales!: CuotaMensual[] | null

}
