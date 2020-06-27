import { Component, OnInit } from '@angular/core';
import { AfiliadoService } from '../../../service/afiliado.service';
import { Afiliado } from '../../../models/afiliado';
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'app-gestion-afiliado',
  templateUrl: './gestion-afiliado.component.html',
  styleUrls: ['./gestion-afiliado.component.css']
})
export class GestionAfiliadoComponent implements OnInit {

  listaAfiliados: Array<Afiliado>;
  showModAfiliado: boolean = false;
  afiliado: Afiliado;


  constructor(
    private _servAfiliado: AfiliadoService,
    public _servLogin: LoginService
  ) { 

    this.listaAfiliados = new Array<Afiliado>();
    this.afiliado = new Afiliado();

  }

  /*Obtener afiliados*/
  public getAfiliados(){
    this.listaAfiliados = new Array<Afiliado>();
    this._servAfiliado.obtenerAfiliados().subscribe(
      (res) => {
        this.listaAfiliados = res as Array<Afiliado>;
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*Crear afiliado*/
  public crearAfiliado(){
    this._servAfiliado.agregarAfiliado(this.afiliado).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    )
    this.getAfiliados();
  }


  /*Modificar afiliado*/
  public modificarAfiliado(){
    this._servAfiliado.actualizarAfiliado(this.afiliado).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    )
  }
  public mostrarModificar(afiliadoMod: Afiliado){
    this.afiliado = afiliadoMod;
    this.showModAfiliado = true;
  }
  public cancelarModificar(){
    this.afiliado = new Afiliado();
    this.showModAfiliado = false;
  }

  /*Eliminar afiliado*/
  public eliminarAfiliado(id: string){
    this._servAfiliado.eliminarAfiliado(id).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    )
    this.getAfiliados();
  }

  ngOnInit(): void {
  }

}
