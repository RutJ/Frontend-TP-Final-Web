import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { element } from 'protractor';
import { LoginService } from 'src/app/service/login.service';

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
    public _servLogin:LoginService
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
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    )
    this.getUsuarios();
  }

  /*eliminar usuario*/
  public eliminarUsuario(usuarioEliminar:Usuario){
    usuarioEliminar.activo = false;
    this._servUsuario.modificarUsuario(usuarioEliminar).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    )
    this.getUsuarios();
  }

  /*Modificar usuario*/
  public modificarUsuario(){
    this._servUsuario.modificarUsuario(this.usuario).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
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
