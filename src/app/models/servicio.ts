import { Afiliado } from 'src/app/models/afiliado';
export class Servicio {
    _id:string;
    nombre:string;
    imagen:string;
    activo:boolean;
    descripcion:string;
    afiliadosInsc:Array<Afiliado> = new Array<Afiliado>();
    constructor(){}
}
