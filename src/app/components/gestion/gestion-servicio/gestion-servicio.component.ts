import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/service/servicio.service';
import { Servicio } from 'src/app/models/servicio';
import { LoginService } from 'src/app/service/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-servicio',
  templateUrl: './gestion-servicio.component.html',
  styleUrls: ['./gestion-servicio.component.css']
})
export class GestionServicioComponent implements OnInit {

  listaServicios:Array<Servicio>;
  servicio:Servicio;
  showModificarServicio:boolean = false;
  validarImagen:boolean = false;
  constructor(
    private _servServicio:ServicioService,
    public _servLogin:LoginService,
    private _toastr:ToastrService) {

    this.listaServicios = new Array<Servicio>();
    this.servicio = new Servicio();
    this.getServicios();
  }
  /*obtener servicios*/
  public getServicios(){
    this.listaServicios = new Array<Servicio>();
    this._servServicio.getServicios().subscribe(
      (result) => {
        console.log(result);
        result.forEach(element => {
          Object.assign(this.servicio, element);
          this.listaServicios.push(this.servicio);
          this.servicio = new Servicio();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*crear servicio*/
  public crearServicio(){
    this.servicio.activo = true;
    this._servServicio.crearServicio(this.servicio).subscribe(
      (result) => {
        this._toastr.success("Servicio Creado","Exito");
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error con crear servicio","Error");
      }
    )
    this.getServicios();
  }
  /*modificar servicio*/
  public modificarServicio(){
    this._servServicio.updateServicio(this.servicio).subscribe(
      (result) => {
        this._toastr.info("Servicio Modificado","Modificado");
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error con crear servicio","Error");
      }
    )
    this.getServicios();
    this.cancelarModificar();
  }

  public cancelarModificar(){
    this.servicio = new Servicio();
    this.showModificarServicio = false;
    this.validarImagen = false;
  }
  public mostrarModificar(servicioModificar:Servicio){
    this.servicio = servicioModificar;
    this.showModificarServicio = true;
    this.validarImagen = true;
  }

  /*desactivar servicio*/
  public desactivarServicio(servicioDesactivar:Servicio){
    servicioDesactivar.activo = false;
    this._servServicio.updateServicio(servicioDesactivar).subscribe(
      (result) => {
        this._toastr.error("Servicio desactivado","Desactivado");
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error con desactivar servicio","Error");
      }
    )
  }

  /*cargar imagen*/
  onFilesChanges(files){
    this.validarImagen = false;
    console.log("Datos del archivo", files);
    if(files[0].size > 45000)
      this._toastr.error("La imagen es muy grande","Error");
    else{
      this.validarImagen = true;
      this.servicio.imagen = files[0].base64;
    }
  }

  ngOnInit(): void {
  }

}
