import { Component, OnInit } from '@angular/core';
import { AfiliadoService } from '../../../service/afiliado.service';
import { Afiliado } from '../../../models/afiliado';
import { LoginService } from '../../../service/login.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { kMaxLength } from 'buffer';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-gestion-afiliado',
  templateUrl: './gestion-afiliado.component.html',
  styleUrls: ['./gestion-afiliado.component.css']
})
export class GestionAfiliadoComponent implements OnInit {

  listaAfiliados: Array<Afiliado>;
  listaAfiliadosFiltro: Array<Afiliado>;
  listaUsuarios: Array<Usuario>;
  showModAfiliado: boolean = false;
  afiliado: Afiliado;
  usuario: Usuario;
  usuarioSocio: Usuario;
  buscarUsuario: boolean = false;
  buscarAfiliado: boolean = false;
  validarImagen: boolean = false;
  filtrarTabla:string="";

  constructor(
    private _servAfiliado: AfiliadoService,
    private _servUsuario: UsuarioService,
    public _servLogin: LoginService,
    private _toastr: ToastrService
  ) {

    this.listaAfiliados = new Array<Afiliado>();
    this.listaAfiliadosFiltro = new Array<Afiliado>();
    this.listaUsuarios = new Array<Usuario>();
    this.afiliado = new Afiliado();
    this.usuario = new Usuario();
    this.usuarioSocio = new Usuario();
    this.getAfiliados();
    this.getUsuarios();

  }

  /*filtrar tabla*/
  public filtrar(){
    this.listaAfiliadosFiltro = this.listaAfiliados.filter(element => element.nombres.toLowerCase().indexOf(this.filtrarTabla) > -1 || element.apellido.toLowerCase().indexOf(this.filtrarTabla) > -1);
  }

  /*Obtener usuarios*/
  public getUsuarios(){
    this.listaUsuarios = new Array<Usuario>();
    this._servUsuario.getUsuarios().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.usuario, element);
          this.listaUsuarios.push(this.usuario);
          this.usuario = new Usuario();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*Obtener afiliados*/
  public getAfiliados() {
    this.listaAfiliados = new Array<Afiliado>();
    this.listaAfiliadosFiltro = new Array<Afiliado>();
    this._servAfiliado.obtenerAfiliados().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.afiliado, element);
          this.listaAfiliados.push(this.afiliado);
          this.listaAfiliadosFiltro.push(this.afiliado);
          this.afiliado = new Afiliado();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*Crear afiliado*/
  public crearAfiliado() {
    this.afiliado.estado = true;
    console.log(this.afiliado);
    this._servAfiliado.agregarAfiliado(this.afiliado).subscribe(
      (res) => {
        this._toastr.success("Afiliado Creado", "Exito");
        this.getAfiliados();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al crear afiliado", "Error");
      }
    )
  }


  /*Modificar afiliado*/
  public modificarAfiliado() {
    this._servAfiliado.actualizarAfiliado(this.afiliado).subscribe(
      (res) => {
        this._toastr.info("Afiliado Modificado", "Modificado");
        this.cancelarModificar();
        this.getAfiliados();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al modificar usuario", "Error");
      }
    )
  }
  public mostrarModificar(afiliadoMod: Afiliado) {
    this.afiliado = afiliadoMod;
    console.log(this.afiliado);
    this.showModAfiliado = true;
    this.validarImagen = true;
  }
  public cancelarModificar() {
    this.afiliado = new Afiliado();
    this.showModAfiliado = false;
    this.validarImagen = false;
  }

  /*Eliminar afiliado*/
  public modificarEstadoAfiliado(afiliado: Afiliado) {
    var i: number = 0;
    afiliado.estado = !afiliado.estado;   
    if (afiliado.estado == false){
      for(i;i <= this.listaUsuarios.length-1; i++){
        if(this.listaUsuarios[i].usuario == afiliado.email){
          this.usuario = this.listaUsuarios[i];
        }  
          this.usuario.activo = false;
          this._servUsuario.modificarUsuario(this.usuario).subscribe(
            (res) => {
              this.getUsuarios();
            }
          );
        }
        
    }else{
      for(i;i <= this.listaUsuarios.length-1; i++){
        if(this.listaUsuarios[i].usuario == afiliado.email){
          this.usuario = this.listaUsuarios[i];
        }  
          this.usuario.activo = true;
          this._servUsuario.modificarUsuario(this.usuario).subscribe(
            (res) => {
              this.getUsuarios();
            }
          );
        }
        
    }
    this._servAfiliado.actualizarAfiliado(afiliado).subscribe(
      (res) => {
        this._toastr.info("Estado del afiliado modificado", "Habilitar/Deshabilitar");
        this.getAfiliados();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al modificar afiliado", "Error");
      }
    )
  }

  /*crear socio*/
  public crearSocio(afiliadoCrear: Afiliado) {
    this._servUsuario.buscarUsuario(afiliadoCrear.email).subscribe(
      (result) => {
        if (result.status == 1)
          this.crear(afiliadoCrear);
        else
          this._toastr.error("Socio/a '"+afiliadoCrear.email+"' ya fue creado","Socio Existente")
      }
    )
  }
  private crear(afiliadoCrear:Afiliado){
    this.usuarioSocio.usuario = afiliadoCrear.email;
    this.usuarioSocio.password = Math.round(Math.random() * 10000000000).toString();
    this.usuarioSocio.activo = true;
    this.usuarioSocio.perfil = "socio";
    this._servUsuario.crearUsuario(this.usuarioSocio).subscribe(
      (result) => {
        this._toastr.success("Socio/a '"+afiliadoCrear.email+"' creado", "Exito");
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al crear usuario", "Error");
      }
    )
  }

  /*Validaciones*/
  public validarNombreUsuario() {
    this._servUsuario.buscarUsuario(this.afiliado.email).subscribe(
      (result) => {
        if (result.status == 2)
          this.buscarUsuario = true;
        else
          this.buscarUsuario = false;
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al validar el nombre de usuario", "Error");
      }
    )
  }

  public validarEmailAfiliado() {
    this._servLogin.buscarAfiliadoEmail(this.afiliado.email).subscribe(
      (result) => {
        if (result.status == 2)
          this.buscarAfiliado = true;
        else
          this.buscarAfiliado = false;
      },
      (error) => {
        console.log(error)
        this._toastr.error("Ha ocurrido un error al validar el emial de afiliado", "Error");
      }
    )
    this.validarNombreUsuario();
  }

  /*validar las imagenes*/
  public validarImagenCambiada(files) {
    if (files[0] != null) {
      this.validarImagen = true;
      this.afiliado.imagen = files[0].base64;
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
          text: 'AFILIADOS',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
          
        },
        {
          text: 'Cantidad total de afiliados : '+ this.listaAfiliadosFiltro.length,
          style: 'jobTitle',
          alignment: 'left',
          bold: true,
        },
        {
          text: 'LISTA DE AFILIADOS',
          bold: true,
          fontSize: 13,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.getAfiliadoObject(),
      ]
    }
  }

  /*TABLA DE AFILIADOS DE UN SERVICIO */
  getAfiliadoObject() {
    return {
      table: {
         headerRows: 1,
        widths: [50,80 , 120 , 165,50],
        body: [
          [
          {
             text: 'NOMBRE', bold: true,
             alignment: 'center',
          },
          {
            text: 'APELLIDO', bold: true,
            alignment: 'center',
          },
          {
            text: 'DNI', bold: true,
            alignment: 'center', 
          },
          {
            text: 'EMAIL', bold: true,
            alignment: 'center',
          },
          {
            text: 'IMAGEN', bold: true,
            alignment: 'center',
          },
          ],
          ...this.listaAfiliadosFiltro.map(afi => {
            return [afi.nombres, afi.apellido, afi.dni, afi.email,this.getProfilePicObject(afi)];
          })
        ]
      }
    };
  }


 /*IMAGEN DEL SERVICIO DEL PDF */
 getProfilePicObject(afiliado: Afiliado ) {
  if (afiliado.imagen) {
    return {
      image: afiliado.imagen ,
      width: 20,
      alignment : 'center'
    };
  }
  return null;
}

  ngOnInit(): void {
  }
}