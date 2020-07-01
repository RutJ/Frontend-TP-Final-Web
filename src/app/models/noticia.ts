import { Usuario } from 'src/app/models/usuario';
export class Noticia {

    _id:string;
    titulo: string;
    imagen: string;
    descripcion: string
    fecha: Date;
    usuario: Usuario = new Usuario();
    vigente: boolean;

    constructor(){}
}
