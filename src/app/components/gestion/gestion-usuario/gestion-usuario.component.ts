import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/service/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css']
})
export class GestionUsuarioComponent implements OnInit {

  listaUsuarios: Array<Usuario>;
  listaUsuariosFiltro: Array<Usuario>;
  usuario: Usuario;
  buscarUsuario: boolean = false;
  showModificarUsuario: boolean = false;
  filtrarTabla:string="";
  constructor(
    private _servUsuario: UsuarioService,
    public _servLogin: LoginService,
    private _toastr: ToastrService
  ) {

    this.listaUsuarios = new Array<Usuario>();
    this.listaUsuariosFiltro = new Array<Usuario>();
    this.usuario = new Usuario();
    this.getUsuarios();
  }

  /*crear usuario*/
  public crearUsuario() {
    this.usuario.activo = true;
    this._servUsuario.crearUsuario(this.usuario).subscribe(
      (result) => {
        this._toastr.success("Usuario Creado", "Exito")
        this.getUsuarios();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al crear usuario", "Error");
      }
    )
  }

  /*modificar estado usuario*/
  public modificarEstadoUsuario(usuario: Usuario) {
    usuario.activo = !usuario.activo;
    this._servUsuario.modificarUsuario(usuario).subscribe(
      (result) => {
        this._toastr.info("Estado del usuario modificado", "Habilitar/Deshabilitar");
        this.getUsuarios();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al eliminar usuario", "Error");
      }
    )
  }

  /*Modificar usuario*/
  public modificarUsuario() {
    this._servUsuario.modificarUsuario(this.usuario).subscribe(
      (result) => {
        this._toastr.info("Usuario Modificado", "Modificado")
        this.getUsuarios();
        this.cancelarModificar();
      },
      (error) => {
        console.log(error);
        this._toastr.error("Ha ocurrido un error al modificar usuario", "Error");
      }
    )
  }
  public mostrarModificar(usuarioModificar: Usuario) {
    this.usuario = usuarioModificar;
    this.showModificarUsuario = true;
  }
  public cancelarModificar() {
    this.usuario = new Usuario();
    this.showModificarUsuario = false;
  }

  /*obtener usuarios*/
  public getUsuarios() {
    this.listaUsuarios = new Array<Usuario>();
    this.listaUsuariosFiltro = new Array<Usuario>();
    this._servUsuario.getUsuarios().subscribe(
      (result) => {
        result.forEach(element => {
          Object.assign(this.usuario, element);
          this.listaUsuarios.push(this.usuario);
          this.listaUsuariosFiltro.push(this.usuario);
          this.usuario = new Usuario();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*Validaciones*/
  public validarNombreUsuario() {
    this._servUsuario.buscarUsuario(this.usuario.usuario).subscribe(
      (result) => {
        console.log(result)
        if (result.status == 2)
          this.buscarUsuario = true;
        else
          this.buscarUsuario = false
      },
      (error) => {
        console.log(error);
      }
    )
  }
  /*filtrar tabla*/
  public filtrar(){
    this.listaUsuariosFiltro = this.listaUsuarios.filter(element => element.usuario.toLowerCase().indexOf(this.filtrarTabla) > -1);
  }

  ngOnInit(): void {
  }

}
