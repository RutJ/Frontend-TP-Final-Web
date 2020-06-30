import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/service/pago.service';
import { LoginService } from 'src/app/service/login.service';
import { Pago } from 'src/app/models/pago';
import { Afiliado } from 'src/app/models/afiliado';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-pago',
  templateUrl: './gestion-pago.component.html',
  styleUrls: ['./gestion-pago.component.css']
})
export class GestionPagoComponent implements OnInit {
  eMail:string;
  pago: Pago;
  afiliado: Afiliado;
  pagos: Array<Pago>;
  showModPago: boolean = false;
  mostrar:boolean=false;

  constructor(private _servPago:PagoService, public _servLogin:LoginService,private _toastr:ToastrService) { 
    this.afiliado = new Afiliado();
    this.pago = new Pago();
    this.pagos = new Array<Pago>();
    this.getPagos();
  }

   /*Obtener pagos*/
   public getPagos(){
    this.pagos = new Array<Pago>();
    this._servPago.getPagos().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.pago, element);
          this.pagos.push(this.pago);
          this.pago = new Pago();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*Crear pago*/
  public crearPago(){
    this.pago.fecha = new Date();
    this.pago.afiliado=this.afiliado;
    this._servPago.addPago(this.pago).subscribe(
      (res) => {
        //console.log(res);
        this._toastr.success("Pago Creado","Exito");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al crear pago","Error");
      }
    );
    this.getPagos();
    this.pago = new Pago();
    this.eMail="";
    this.mostrar=false;
  }


  ngOnInit(): void {
  }

  /*obtener Afiliado*/
  public obtenerAfiliadoPorEmail(){
    this.afiliado = new Afiliado();
    this._servLogin.buscarAfiliadoEmail(this.eMail).subscribe(
      (result)=>{
        if(result.status == 2){
          this.afiliado=result.afi;
          this._toastr.success("Afiliado Encontrado","Exito");
          this.mostrar=true;
        }
        else{
          this._toastr.error("No se encontro el Afiliado","Error");
          this.eMail="";
        }
      },
      (error) => {
        console.log(error); 
      }
    )
  }

  /*Eliminar Pago*/
   public eliminarPago(_id:string){
    this._servPago.deletePago(_id).subscribe(
      (res) => {
        //console.log(res);
        this._toastr.error("Pago Eliminado","Eliminado");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al eliminar un Pago","Error");
      }
    );
    this.getPagos();
  }

  /*Modificar Pago*/
  public modificarPago(){
    this.pago.fecha = new Date();
    this.pago.afiliado=this.afiliado;
    this._servPago.updatePago(this.pago).subscribe(
      (res) => {
        //console.log(res);
        this._toastr.info("Pago Modificado","Modificado");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al modificar Pago","Error");
      }
    )
    this.cancelarModificar();
    this.getPagos();
    this.mostrar=false;
  }
  public mostrarModificar(pagoMod: Pago){
    this.pago = pagoMod;
    this.eMail = pagoMod.afiliado.email;
    this.showModPago = true;
    this.mostrar=true;
  }
  public cancelarModificar(){
    this.pago = new Pago();
    this.showModPago = false;
    this.mostrar=false;
    this.eMail="";
  }



}
