import { Component, OnInit } from '@angular/core';
import { Noticia } from 'src/app/models/noticia';
import { NoticiaService } from 'src/app/service/noticia.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/service/login.service';
/*para facebook*/
import { FacebookService, InitParams, LoginResponse } from 'ngx-fb';
import { ApiMethod } from 'ngx-fb/dist/esm/providers/facebook';

@Component({
  selector: 'app-gestion-noticia',
  templateUrl: './gestion-noticia.component.html',
  styleUrls: ['./gestion-noticia.component.css']
})
export class GestionNoticiaComponent implements OnInit {

  listaNoticias:Array<Noticia>;
  noticia:Noticia;
  validarImagen:boolean=false;
  showModificarNoticia:boolean = false;

  constructor(
    private _servNotica:NoticiaService,
    private _tostr:ToastrService,
    public _servLogin:LoginService,
    private _fb:FacebookService) {

    this.listaNoticias = new Array<Noticia>();
    this.noticia = new Noticia();
    this.getNoticias();
    this.iniciarFb();
  }

  /*iniciar en facebook*/
  iniciarFb() {
    let initParams: InitParams = {
      appId: '934317636995922', //mi appId de facebook for developers
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v7.0'
    };
    this._fb.init(initParams);
  }
  realizarPosteo(noticia:Noticia) {
    var apiMethod: ApiMethod = "post";
    this._fb.api('/109421504150971/feed', apiMethod,
      {
        "message": noticia.titulo + "\n" + "\n" + noticia.descripcion,
        "access_token":"EAANRwcbcS1IBAAHm3CCyC4XTYWNl7B0IysOKZC4m8JdwQNGrzcPMhZA4ZAVu17ThiOSc3oG86Qn7IIVuoHdpzGtKgqI4ZADCvhwLZB2A0maTKwUbNSjIlxjDarwDEhAZArTG5ppDZAZBoNmgCdLd8BMKWaWasLTIwh0qAk93o8YNYgCkostfvZBtn16wHOHlp0Vl4xZBZAKyFp1XgZDZD"
      });
  }

  /*crear noticia*/
  public crearNoticia(){
    this.noticia.usuario = this._servLogin.usuarioLogeado;
    this.noticia.vigente = true;
    this._servNotica.createNoticia(this.noticia).subscribe(
      (result) => {
        this._tostr.success("Noticia creada","Exito");
        this.getNoticias();
      },
      (error) => {
        console.log(error);
        this._tostr.error("Ha ocurrido un error al crear una noticia","Error");
      }
    )
  }
  /*modificar noticia*/
  public modificarNoticia(){
    this._servNotica.updateNoticia(this.noticia).subscribe(
      (result) => {
        this._tostr.info("Noticia modificada","Modificada");
        this.getNoticias();
        this.cancelarModificar();
      }
    )
  }
  public mostrarModificar(noticiaModificar:Noticia){
    this.showModificarNoticia = true;
    this.noticia = noticiaModificar;
    this.validarImagen = true;
  }

  public cancelarModificar(){
    this.showModificarNoticia = false;
    this.noticia = new Noticia();
    this.validarImagen = false;
  }


  /*modificar el estado de la noticia*/
  public modificarEstadoNoticia(noticiaDesactivar:Noticia){
    noticiaDesactivar.vigente = !noticiaDesactivar.vigente;
    this._servNotica.updateNoticia(noticiaDesactivar).subscribe(
      (result) => {
        this._tostr.info("Estado de la noticia actualizado","Activar/Desactivar");
        this.getNoticias();
      },
      (error) => {
        this._tostr.error("Ha ocurrido un error al crear una noticia","Error");
      }
    )
  }
  /*obtener noticias*/
  public getNoticias(){
    this.listaNoticias = new Array<Noticia>();
    this._servNotica.getNoticias().subscribe(
      (result) => {
        console.log(result);
        this.listaNoticias = result;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*cargar imagen*/
  onFilesChanges(files) {
    if(files[0] != null){
      this.validarImagen = true;
      this.noticia.imagen = files[0].base64;
    }else{
      this.validarImagen = false;
    }
  }

  ngOnInit(): void {
  }

}
