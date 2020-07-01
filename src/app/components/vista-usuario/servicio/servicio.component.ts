import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/service/servicio.service';
import { Servicio } from 'src/app/models/servicio';
import { LoginService } from 'src/app/service/login.service';
import { Afiliado } from 'src/app/models/afiliado';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

  listaServicios:Array<Servicio>;
  listaServiciosVisitados:Array<Servicio>;
  listaServiciosNoVisitados:Array<Servicio>;
  servicio:Servicio;
  constructor(private _servServicio:ServicioService, public _servLogin:LoginService) {
    this.listaServicios = new Array<Servicio>();
    this.listaServiciosVisitados = new Array<Servicio>();
    this.listaServiciosNoVisitados = new Array<Servicio>();
    this.servicio = new Servicio();
    this.getServicios();
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
  
  /*inscribir socio*/
  public inscribirAfiliado(servicioInscribir:Servicio){
    if(this._servLogin.isAfiliadoLogeado){
      servicioInscribir.afiliadosInsc.push(this._servLogin.afiliadoLogeado);
      this._servServicio.updateServicio(servicioInscribir).subscribe(
        (result) => {
          console.log(result);
          this.getServicios();
        },
        (error) => {
          console.log(error);
        }
      )
    }
    else{
      console.log("no hay socio");
    }

    
  }

  public darBaja(servicioBaja:Servicio){
    servicioBaja.afiliadosInsc.splice(this.buscarAfiliado(servicioBaja),1);
    this._servServicio.updateServicio(servicioBaja).subscribe(
      (result) => {
        console.log(result);
        this.getServicios();
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*asigna en un array los servicios inscriptos por el afiliado, y en otro array los servicios no inscriptos*/
  public verificarServicios(){
    this.listaServiciosVisitados = new Array<Servicio>();
    this.listaServiciosNoVisitados = new Array<Servicio>();
    var afiliadoAuxiliar = new Afiliado();
    this.listaServicios.forEach(servicioUnico => {
      if(servicioUnico.activo){
        afiliadoAuxiliar = servicioUnico.afiliadosInsc[this.buscarAfiliado(servicioUnico)];
        if(afiliadoAuxiliar != null){
          this.listaServiciosVisitados.push(servicioUnico);
        }else{
          this.listaServiciosNoVisitados.push(servicioUnico);
        }
      }
    });
  }

  private buscarAfiliado(servicioUnico:Servicio):number{
    return servicioUnico.afiliadosInsc.findIndex(element => element._id == this._servLogin.afiliadoLogeado._id)
  }

  ngOnInit(): void {
  }

}
