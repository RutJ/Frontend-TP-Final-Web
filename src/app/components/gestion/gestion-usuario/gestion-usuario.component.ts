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

  listaUsuarios:Array<Usuario>;
  usuario:Usuario;
  buscarUsuario:boolean=false;
  showModificarUsuario:boolean = false;
  constructor(
    private _servUsuario:UsuarioService,
    public _servLogin:LoginService,
    private _toastr:ToastrService
    ) {

    this.listaUsuarios = new Array<Usuario>();
    this.usuario = new Usuario();
    this.getUsuarios();
  }

  /*crear usuario*/
  public crearUsuario(){
    this.usuario.activo = true;
    this._servUsuario.crearUsuario(this.usuario).subscribe(
      (result) => {
        //console.log(result);
        this._toastr.success("Usuario Creado","Exito")
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al crear usuario","Error");
      }
    )
    this.getUsuarios();
  }

  /*eliminar usuario*/
  public eliminarUsuario(usuarioEliminar:Usuario){
    usuarioEliminar.activo = false;
    this._servUsuario.modificarUsuario(usuarioEliminar).subscribe(
      (result) => {
        //console.log(result);
        this._toastr.error("Usuario Eliminado","Eliminado");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al eliminar usuario","Error");
      }
    )
    this.getUsuarios();
  }

  /*Modificar usuario*/
  public modificarUsuario(){
    this._servUsuario.modificarUsuario(this.usuario).subscribe(
      (result) => {
        //console.log(result);
        this._toastr.info("Usuario Modificado","Modificado")
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al modificar usuario","Error");
      }
    )
    this.cancelarModificar();
  }
  public mostrarModificar(usuarioModificar:Usuario){
    this.usuario = usuarioModificar;
    this.showModificarUsuario = true;
  }
  public cancelarModificar(){
    this.usuario = new Usuario();
    this.showModificarUsuario = false;
  }

  /*obtener usuarios*/
  public getUsuarios(){
    this.listaUsuarios = new Array<Usuario>();
    this._servUsuario.getUsuarios().subscribe(
      (result) => {
        result.forEach(element => {
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

  /*Validaciones*/
  public validarNombreUsuario(){
    this._servUsuario.buscarUsuario(this.usuario.usuario).subscribe(
      (result) => {
        console.log(result)
        if(result.status == 2)
          this.buscarUsuario = true;
        else
          this.buscarUsuario = false
      },
      (error) => {
        console.log(error);
      }
    )
  }

  ngOnInit(): void {
  }

}
