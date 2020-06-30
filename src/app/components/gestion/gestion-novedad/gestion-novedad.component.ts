import { Component, OnInit } from '@angular/core';
import { Novedad } from 'src/app/models/novedad';
import { NovedadService } from 'src/app/service/novedad.service';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from '../../../service/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-novedad',
  templateUrl: './gestion-novedad.component.html',
  styleUrls: ['./gestion-novedad.component.css']
})
export class GestionNovedadComponent implements OnInit {

  novedad:Novedad;
  usuario:Usuario;
  novedadMod: Boolean;
  textoVer:string;

  novedades:Array<Novedad>;
  constructor(private novedadService:NovedadService,
    public _servLogin: LoginService,
    private _toastr:ToastrService) { 
    this.novedad = new Novedad();
    this.novedad.usuario = this._servLogin.usuarioLogeado;
    this.novedades = new Array<Novedad>();
    
    this.obtenerNovedades();
  }

  ngOnInit(): void {
  }


  //CRUD---------------------------------------------------
  /**ENVIAR NOVEDAD */
  enviarNovedad(){
    this.novedad._id=null;
    this.novedad.estado="pendiente";
    this.novedad.fecha = new Date();
    this.novedadService.addNovedad(this.novedad).subscribe(
      (result) =>{
        alert("Novedad Enviado");
      },
      (error) =>{
        alert("No se pudo enviar la novedad")
        console.log(error);
      }
    )
  }
  
  
  /**OBTENER NOVEDAD */
  obtenerNovedades(){
    this.novedades = new Array<Novedad>();
    this.novedadService.getNovedades().subscribe(
      (result) =>{
        var novedad: Novedad = new Novedad();
        result.forEach(element => {
          Object.assign(novedad,element);
          this.novedades.push(novedad);
          novedad = new Novedad();
        });
      },
      (error) =>{
        alert("No se pudo obtener novedades")
        console.log(error);
      }
    )
  }
  
  /**MODIFICAR NOVEDAD */
  public modificarNovedad(){
    this.novedadService.editNovedad(this.novedad).subscribe(
      (result) => {
        this._toastr.info("Novedad modificada","Modificado");
      },
      (error) => {
        this._toastr.error("No se pudo modificar la novedad","Error");
      }
    )
    this.cancelarModificar();
  }
  /**ELIMINAR NOVEDAD */
  public eliminarNovedad(novedad: Novedad){
    this.novedadService.deleteNovedad(novedad).subscribe(
      (result) => {
        this._toastr.error("Novedad Eliminado","Eliminado");
      },
      (error) => {
        this._toastr.error("No se pudo eliminar el usuario","Error");
      }
    )
  }


  //-------------------------------------------
  
  /**MOSTRAR MODIFICAR */
  public mostrarModificar(novedad: Novedad){
    this.novedad = novedad;
    this.novedadMod = true;
  }

  /**CANCELAR MODIFICAR */
  public cancelarModificar(){
    this.novedad = new Novedad();
    this.novedadMod = false;
  }

  
  /**VER NOVEDAD */
  public verNovedad(novedad:Novedad){
    this.textoVer=novedad.texto;
    if(novedad.estado=="pendiente"){
    novedad.estado="procesado";
    this.novedad=novedad;
    this.modificarNovedad();
    }
  }
}
