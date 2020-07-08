import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { NovedadService } from 'src/app/service/novedad.service';
import { Novedad } from 'src/app/models/novedad';
import { Usuario } from 'src/app/models/usuario';
import { PagoService } from 'src/app/service/pago.service';
import { Pago } from 'src/app/models/pago';
import { ServicioService } from 'src/app/service/servicio.service';
import { Servicio } from 'src/app/models/servicio';
import { Afiliado } from 'src/app/models/afiliado';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  
  servicioUrl:string; 
  pagoUrl:string; 
  novedadUrl:string; 

  servicio:Servicio;
  listaServicios:Array<Servicio>;
  listaServiciosVisitados:Array<Servicio>;

  listaPagos: Array<Pago>;
  pago:Pago;
  
  novedad:Novedad;
  usuario:Usuario;

  passNueva:string="";

  novedades:Array<Novedad>;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servServicio:ServicioService,
    private _servPago:PagoService,
    private novedadService:NovedadService,
    public _servLogin: LoginService,
    private _servUsuario: UsuarioService,
    private _toast:ToastrService) { 
    
      
    this.listaServicios = new Array<Servicio>();
    this.listaServiciosVisitados = new Array<Servicio>();
    this.listaPagos= new Array<Pago>();
    
    this.servicio = new Servicio();
    this.pago= new Pago();

    this.novedades = new Array<Novedad>();
    this.usuario = new Usuario();
    
    this.obtenerPagos();
    this.obtenerNovedades();
    this.getServicios();
    }

  ngOnInit(): void {
    this.servicioUrl = this._route.snapshot.queryParams['servicioUrl'] || '/vista-servicio';
    this.pagoUrl = this._route.snapshot.queryParams['servicioUrl'] || '/vista-pago';
    this.novedadUrl = this._route.snapshot.queryParams['servicioUrl'] || '/vista-novedad';
  }



  obtenerNovedades(){
    this.novedades = new Array<Novedad>();
    this.novedadService.getNovedades().subscribe(
      (result) =>{
        var novedad: Novedad = new Novedad();
        result.forEach(element => {
          if(element.usuario.usuario == this._servLogin.usuarioLogeado.usuario){
            Object.assign(novedad,element);
            this.novedades.push(novedad);
          }
            novedad = new Novedad();
        });
      },
      (error) =>{
        alert("No se pudo obtener novedades")
        console.log(error);
      }
    )
  }
 

  /*Obtener pagos*/
  public obtenerPagos(){
    this.listaPagos = new Array<Pago>();
    this._servPago.getPagos().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.pago, element);
          if(this._servLogin.usuarioLogeado.usuario == this.pago.afiliado.email){
            this.listaPagos.push(this.pago);
          }
          this.pago = new Pago();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  public modificarPass(){
    console.log(this.passNueva);
    this._servLogin.usuarioLogeado.password = this.passNueva;
    this._servUsuario.modificarUsuario(this._servLogin.usuarioLogeado).subscribe(
      (result) => {
        console.log(result);
        this._toast.success("Contraseña modificada","Exito");
        this.passNueva = "";
      },
      (error) => {
        console.log(error);
        this._toast.error("Ha ocurrido un error al intentar modificar la contraseña","Error")
      }
    )
  }




  public getServicios(){
    this.listaServicios = new Array<Servicio>();
    this._servServicio.getServicios().subscribe(
      (result) => {
        this.listaServicios = result;
        /*result.forEach(element => {
          Object.assign(this.servicio, element);
          this.listaServicios.push(this.servicio);
          this.servicio = new Servicio();         
        });*/
        this.verificarServicios();
      },
      (error) => {
        console.log(error);
      }
    )
  }

 public verificarServicios(){
    this.listaServiciosVisitados = new Array<Servicio>();
    var afiliadoAuxiliar = new Afiliado();
    this.listaServicios.forEach(servicioUnico => {
      if(servicioUnico.activo){
        afiliadoAuxiliar = servicioUnico.afiliadosInsc[this.buscarAfiliado(servicioUnico)];
        if(afiliadoAuxiliar != null){
          servicioUnico.descripcion = servicioUnico.descripcion.substring(0,100) + "...";
          this.listaServiciosVisitados.push(servicioUnico);
        }
      }
    });
  }

  private buscarAfiliado(servicioUnico:Servicio):number{
    return servicioUnico.afiliadosInsc.findIndex(element => element._id == this._servLogin.afiliadoLogeado._id)
  }

  public redirigirServicio(){
    this._router.navigateByUrl(this.servicioUrl);
  }
  public redirigirPago(){
    this._router.navigateByUrl(this.pagoUrl);
  }
  public redirigirNovedad(){
    this._router.navigateByUrl(this.novedadUrl);
  }

}
