import { Component, OnInit } from '@angular/core';
import { Novedad } from 'src/app/models/novedad';
import { NovedadService } from 'src/app/service/novedad.service';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from '../../../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { Afiliado } from 'src/app/models/afiliado';

@Component({
  selector: 'app-gestion-novedad',
  templateUrl: './gestion-novedad.component.html',
  styleUrls: ['./gestion-novedad.component.css']
})
export class GestionNovedadComponent implements OnInit {

  novedad:Novedad;
  usuario:Usuario;
  novedadMod: Boolean;
  afiliado:Afiliado;

  afiliados:Array<Afiliado>;
  novedades:Array<Novedad>;
  constructor(private novedadService:NovedadService,
    public _servLogin: LoginService,
    private _toastr:ToastrService) { 
    this.novedad = new Novedad();
    this.novedad.usuario = this._servLogin.usuarioLogeado;
    this.novedades = new Array<Novedad>();
    this.afiliados = new Array<Afiliado>();
    this.obtenerNovedades();
  }

  ngOnInit(): void {
  }


  //CRUD---------------------------------------------------

  
  
  /**OBTENER NOVEDAD */
  obtenerNovedades(){
    this.novedades = new Array<Novedad>();
    this.afiliados = new Array<Afiliado>();
    this.novedadService.getNovedades().subscribe(
      (result) =>{
        var novedad: Novedad = new Novedad();
        result.forEach(element => {
          if(!element.quitado){
            Object.assign(novedad,element);
            this.novedades.push(novedad);
            this.obtenerAfiliadoPorEmail(novedad.usuario.usuario)
            novedad = new Novedad();
          }
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
  }

  
  /**ELIMINAR NOVEDAD */
  /*
  public eliminarNovedad(novedad: Novedad){
    this.afiliados = new Array<Afiliado>();
    this.novedades = new Array<Novedad>();
    this.novedadService.deleteNovedad(novedad).subscribe(
      (result) => {
        this._toastr.error("Novedad Eliminado","Eliminado");
        this.obtenerNovedades();
      },
      (error) => {
        this._toastr.error("No se pudo eliminar el usuario","Error");
      }
    )
  }
*/
  public quitarNovedad(novedad:Novedad){
    novedad.quitado=true;
    this.novedad=novedad;
    this.modificarNovedad();
    this.obtenerNovedades();
  }


  /*obtener Afiliado*/
  public obtenerAfiliadoPorEmail(eMail){
    this.afiliado = new Afiliado();
    this._servLogin.buscarAfiliadoEmail(eMail).subscribe(
      (result)=>{
        if(result.status == 2){
          this.afiliado=result.afi;
          if(this.verificarAfiliado(eMail))
            this.afiliados.push(this.afiliado);
        }
        else{
          this._toastr.error("No se encontro el Afiliado","Error");
          //this.eMail="";
        }
      },
      (error) => {
        console.log(error); 
      }
    )
  }
  //-------------------------------------------
  public verificarAfiliado(eMail:string){
    var aux:Boolean=true;
    this.afiliados.forEach(element => {
      if(element.email==eMail)
        aux=false;
    });
    return aux;
  }
  
  /**VER NOVEDAD */
  public verNovedad(novedad:Novedad){
    if(novedad.estado=="pendiente"){
    novedad.estado="procesado";
    this.novedad=novedad;
    this.modificarNovedad();
    }
  }

}

