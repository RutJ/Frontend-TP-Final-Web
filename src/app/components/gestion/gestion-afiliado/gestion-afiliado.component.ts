import { Component, OnInit } from '@angular/core';
import { AfiliadoService } from '../../../service/afiliado.service';
import { Afiliado } from '../../../models/afiliado';
import { LoginService } from '../../../service/login.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-afiliado',
  templateUrl: './gestion-afiliado.component.html',
  styleUrls: ['./gestion-afiliado.component.css']
})
export class GestionAfiliadoComponent implements OnInit {

  listaAfiliados: Array<Afiliado>;
  listaAfiliadosFiltro: Array<Afiliado>;
  showModAfiliado: boolean = false;
  afiliado: Afiliado;
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
    this.afiliado = new Afiliado();
    this.usuarioSocio = new Usuario();
    this.getAfiliados();

  }

  /*filtrar tabla*/
  public filtrar(){
    this.listaAfiliadosFiltro = this.listaAfiliados.filter(element => element.nombres.toLowerCase().indexOf(this.filtrarTabla) > -1 || element.apellido.toLowerCase().indexOf(this.filtrarTabla) > -1);
  }

  /*Obtener afiliados*/
  public getAfiliados() {
    this.listaAfiliados = new Array<Afiliado>();
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
    this.showModAfiliado = true;
    this.validarImagen = true;
  }
  public cancelarModificar() {
    this.afiliado = new Afiliado();
    this.showModAfiliado = false;
    this.validarImagen = false;
  }

  /*Eliminar afiliado*/
  public eliminarAfiliado(id: string) {
    this._servAfiliado.eliminarAfiliado(id).subscribe(
      (res) => {
        this._toastr.error("Afiliado Eliminado", "Eliminado");
        this.getAfiliados();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al crear usuario", "Error");
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

  ngOnInit(): void {
  }
}