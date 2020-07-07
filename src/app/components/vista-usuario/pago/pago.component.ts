import { Component, OnInit } from '@angular/core';
import { Pago } from 'src/app/models/pago';
import { PagoService } from 'src/app/service/pago.service';
import { LoginService } from 'src/app/service/login.service';
import { ToastrService } from 'ngx-toastr';
import { Afiliado } from 'src/app/models/afiliado';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  listaPagos: Array<Pago>;
  pago:Pago;
  afiliado: Afiliado;


  constructor(private _servPago:PagoService, public _servLogin:LoginService,private _toastr:ToastrService) { 
    this.listaPagos= new Array<Pago>();
    this.pago= new Pago();
    this.afiliado= new Afiliado();
    this.obtenerAfiliadoPorEmail();
    this.obtenerPagos();
  }

  /*Obtener pagos*/
  public obtenerPagos(){
    this.listaPagos = new Array<Pago>();
    this._servPago.getPagos().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.pago, element);
          if(this.afiliado.email == this.pago.afiliado.email){
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

  /*obtener Afiliado*/
  public obtenerAfiliadoPorEmail(){
    this.afiliado = new Afiliado();
    this._servLogin.buscarAfiliadoEmail(this._servLogin.afiliadoLogeado.email).subscribe(
      (result)=>{
        if(result.status == 2){
          this.afiliado=result.afi;
        }
      },
      (error) => {
        console.log(error); 
      }
    )
  }

  ngOnInit(): void {
  }

}
