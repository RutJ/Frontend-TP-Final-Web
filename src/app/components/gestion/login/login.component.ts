import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  returnUrl: string;
  msglogin: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servLogin: LoginService
  ) {

    this.usuario = new Usuario();
  }

  login() {
    this._servLogin.login(this.usuario.usuario, this.usuario.password)
      .subscribe(
        (result) => {
          console.log(result);
          if (result.status == 1) {
            if (result.user.activo) {
              this._servLogin.isUsuarioLogeado = true;
              this._servLogin.usuarioLogeado = result.user;
              this.validarUsuarioSocio();
              this._router.navigateByUrl(this.returnUrl);
            }else{
              this.msglogin = "Su cuenta se encuentra inactiva, por favor comunicarse con un administrativo";
            }
          } else {
            this.msglogin = "Credenciales incorrectas..";
          }
        },
        error => {
          console.log("error en conexion");
          console.log(error);
        });
  }

  private validarUsuarioSocio(){
    if(this._servLogin.usuarioLogeado.perfil == "socio"){
      this._servLogin.buscarAfiliadoEmail(this._servLogin.usuarioLogeado.usuario).subscribe(
        (result) => {
          console.log(result);
          this._servLogin.isAfiliadoLogeado = true;
          this._servLogin.afiliadoLogeado = result.afi;
        },
        (error) => {
          console.log(error);
        }
      )
    }else{
      this._servLogin.logoutAfiliado();
    }
  }

  ngOnInit(): void {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/home';
  }

}
