import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/service/pago.service';
import { LoginService } from 'src/app/service/login.service';
import { Pago } from 'src/app/models/pago';
import { Afiliado } from 'src/app/models/afiliado';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  monto:number=0;
  filtrarTabla:string="";
  listaPagosFiltro: Array<Pago>;
  listaPagosAfiliado:Array<Pago>;
  

  constructor(private _servPago:PagoService, public _servLogin:LoginService,private _toastr:ToastrService) { 
    this.afiliado = new Afiliado();
    this.pago = new Pago();
    this.pagos = new Array<Pago>();
    this.listaPagosFiltro= new Array<Pago>();
    this.listaPagosAfiliado= new Array<Pago>();
    //this.pagos = JSON.parse(sessionStorage.getItem('pagos')) || new Array<Pago>();
    this.getPagos();
    
  }

   /*Obtener pagos*/
   public getPagos(){
    this.pagos = new Array<Pago>();
    this.listaPagosFiltro = new Array<Pago>();
    this._servPago.getPagos().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.pago, element);
          this.pagos.push(this.pago);
          this.listaPagosFiltro.push(this.pago);
          this.listaPagosAfiliado.push(this.pago);
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
          this.eMail=this.afiliado.email;
          this.asignarMesAnioPago();
          this._toastr.success("Afiliado Encontrado","Exito");
          this.mostrar=true;
          
        }
        else{
          this._toastr.error("No se encontro el Afiliado","Error");
          this.eMail="";
          this.mostrar=false;
        }
      },
      (error) => {
        console.log(error); 
      }
    )
  }

  public asignarMesAnioPago(){
    if(this.listaPagosAfiliado.length==0){
      this.pago.mes=new Date().getMonth()+1;
      this.pago.anio=new Date().getFullYear();
    }else if(this.listaPagosAfiliado[this.listaPagosAfiliado.length-1].mes<12){
      this.pago.mes=this.listaPagosAfiliado[this.listaPagosAfiliado.length-1].mes+1;
      this.pago.anio=this.listaPagosAfiliado[this.listaPagosAfiliado.length-1].anio;
    }else if(this.listaPagosAfiliado[this.listaPagosAfiliado.length-1].mes==12){
      this.pago.mes=1;
      this.pago.anio=this.listaPagosAfiliado[this.listaPagosAfiliado.length-1].anio+1;
    }
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

  /*GENERAR PDF*/
  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }
/*CONTENIDO DEL PDF*/
  getDocumentDefinition() {
    this.obtenertotal();
    //sessionStorage.setItem('pagos', JSON.stringify(this.pagos));
    return {
      
      footer: {
        columns: [
          { text: 'EMPRESA: OSFI - EMAIL: obrasocialnsqp@gmail.com - TEL: 0388-154201337', alignment: 'center', color: 'gray' }
        ]
      },
      content: [
        {
          text: 'Reporte pagos',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [5, 2, 10, 10]
        },
        {
          text: 'TABLA',
          style: 'header',
          margin: [5, 5, 5, 5],
          alignment: 'center',
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [ 170 , 100 , 100, 100 ],
    
            body: [
              [ { text: 'Email Afiliado', bold: true }, { text: 'MONTO $', bold: true }, { text: 'AÑO', bold: true }, { text: 'MES', bold: true } ],
              [ {
                ul : [
                  ...this.listaPagosFiltro.filter((value, index) => index % 1 === 0).map(s => s.afiliado.email)
                ]
              },{
                ul : [
                  ...this.listaPagosFiltro.filter((value, index) => index % 1 === 0).map(s => s.monto)
                ]
              }, {
                ul : [
                  ...this.listaPagosFiltro.filter((value, index) => index % 1 === 0).map(s => s.anio)
                ]
              }, {
                ul : [
                  ...this.listaPagosFiltro.filter((value, index) => index % 1 === 0).map(s => s.mes)
                ]
              } ],
              [ { text: 'TOTAL', bold: true }, this.monto +'$', '-', '-' ]
            ]
          }
        },

        { qr: new Date+ ', Numero Contacto : ' + '0388-154201337', fit : 100 ,margin: [15, 15, 15, 15],},
      ]
    }
  }
  

  obtenertotal(){
    this.monto=0;
    for (let i = 0; i < this.listaPagosFiltro.length; i++) {
      const element = this.listaPagosFiltro[i];
      this.monto=this.monto+element.monto
    }
  }

  /*filtrar tabla*/
  public filtrar(){
    this.listaPagosFiltro = this.pagos.filter(element => element.afiliado.email.toLowerCase().indexOf(this.filtrarTabla) > -1);
  }
  public filtrarPagos(){
    this.listaPagosAfiliado = this.pagos.filter(element => element.afiliado.email.toLowerCase().indexOf(this.eMail) > -1);
  }


}
