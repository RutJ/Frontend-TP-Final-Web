import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/service/servicio.service';
import { Servicio } from 'src/app/models/servicio';
import { LoginService } from 'src/app/service/login.service';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Afiliado } from 'src/app/models/afiliado';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-gestion-servicio',
  templateUrl: './gestion-servicio.component.html',
  styleUrls: ['./gestion-servicio.component.css']
})
export class GestionServicioComponent implements OnInit {

  listaServicios: Array<Servicio>;
  servicio: Servicio;
  showModificarServicio: boolean = false;
  validarImagen: boolean = false;
  constructor(
    private _servServicio: ServicioService,
    public _servLogin: LoginService,
    private _toastr: ToastrService) {

    this.listaServicios = new Array<Servicio>();
    this.servicio = new Servicio();
    this.getServicios();
  }
  /*obtener servicios*/
  public getServicios() {
    this.listaServicios = new Array<Servicio>();
    this._servServicio.getServicios().subscribe(
      (result) => {
        //console.log(result);
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
  public crearServicio() {
    this.servicio.activo = true;
    this._servServicio.crearServicio(this.servicio).subscribe(
      (result) => {
        this._toastr.success("Servicio Creado", "Exito");
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error con crear servicio", "Error");
      }
    )
    this.getServicios();
  }
  /*modificar servicio*/
  public modificarServicio() {
    this._servServicio.updateServicio(this.servicio).subscribe(
      (result) => {
        this._toastr.info("Servicio Modificado", "Modificado");
        this.getServicios();
        this.cancelarModificar();
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error con crear servicio", "Error");
      }
    )
  }

  public cancelarModificar() {
    this.servicio = new Servicio();
    this.showModificarServicio = false;
    this.validarImagen = false;
  }
  public mostrarModificar(servicioModificar: Servicio) {
    this.servicio = servicioModificar;
    this.showModificarServicio = true;
    this.validarImagen = true;
  }

  /*desactivar servicio*/
  public modificarEstadoServicio(servicio: Servicio) {
    servicio.activo = !servicio.activo;
    this._servServicio.updateServicio(servicio).subscribe(
      (result) => {
        this._toastr.info("Estado de servicio modificado", "Desactivado/Activado");
        this.getServicios();
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error con desactivar servicio", "Error");
      }
    )
  }

  /*cargar imagen*/
  onFilesChanges(files) {
    if (files[0] != null) {
      this.validarImagen = true;
      this.servicio.imagen = files[0].base64;
    } else {
      this.validarImagen = false;
    }

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
  /*CONTENIDO DEL PDF */
  getDocumentDefinition() {
    return {
      footer: {
        columns: [
          { text: 'EMPRESA: OSFI - EMAIL: obrasocialnsqp@gmail.com - TEL: 0388-154201337', alignment: 'center', color: 'gray' }
        ]
      },
      content: [
        {
          text: 'SERVICIOS',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Cantidad de servicios: ' + this.listaServicios.length,
          bold: true,
          fontSize: 10,
          alignment: 'left',
          margin: [10, 10, 10, 10]
        },
        this.getServiceObject(this.listaServicios), 
      ]
    }
  }

  /*LISTA DE SERVICIOS */
  getServiceObject(listaServicios: Array<Servicio>) {
    const serv = [];
    listaServicios.forEach(servicio => {
      serv.push(
        [{
          columns: [[
            [
              this.getProfilePicObject(servicio),
            ],
            [{
              text: 'NOMBRE: '+servicio.nombre,
              style: 'jobTitle',
              alignment: 'left',
            },
            {
              text: 'ACTIVO?: '+ servicio.activo,
              alignment: 'left',
            },
            {
              text: 'CANTIDAD DE INSCRIPTOS: '+ servicio.afiliadosInsc.length,
              alignment: 'left',
            },
            {
              text: 'DESCRIPCION: '+servicio.descripcion,
              alignment: 'left',
            },
            {
              text: 'LISTA DE INSCRIPTOS: ',
              alignment: 'center',
              bold: true,
            },
           
          ],
          this.getAfiliadoObject(servicio.afiliadosInsc),
        ],
        ],
      }]
    );
  });
    return {
      table: {
        widths: ['*'],
        body: [
          ...serv
        ]
      }
    };
  }
  /*IMAGEN DEL SERVICIO DEL PDF */
  getProfilePicObject(servicio: Servicio) {
    if (servicio.imagen) {
      return {
        image: servicio.imagen ,
        width: 75,
        alignment : 'center'
      };
    }
    return null;
  }
  /*TABLA DE AFILIADOS DE UN SERVICIO */
  getAfiliadoObject(afiliados: Array<Afiliado>) {
    return {

      table: {
         headerRows: 1,
        widths: [100, 100, 100, 170],
        body: [
          [
          {
             text: 'NOMBRE', bold: true
          },
          {
            text: 'APELLIDO', bold: true 
          },
          {
            text: 'DNI', bold: true 
          },
          {
            text: 'EMAIL', bold: true 
          },
          ],
          ...afiliados.map(afi => {
            return [afi.nombres, afi.apellido, afi.dni, afi.email];
          })
        ]
      }
    };
  }

 

  ngOnInit(): void {
  }

}
