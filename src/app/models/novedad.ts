import { Usuario } from './usuario';

export class Novedad {
    _id:string;
    usuario:Usuario;
    asunto: string;
    texto: string;
    estado: string;
    fecha:Date;

    constructor(){}
}
