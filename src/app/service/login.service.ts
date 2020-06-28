import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Afiliado } from 'src/app/models/afiliado';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isUsuarioLogeado: boolean = false;
  isAfiliadoLogeado: boolean = false;

  usuarioLogeado: Usuario = new Usuario();
  afiliadoLogeado: Afiliado = new Afiliado();

  urlBase: string = "http://localhost:3000/api/usuarios/";
  constructor(private _http: HttpClient) { }

  public login(usuario: string, password: string): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify({ usuario: usuario, password: password });
    return this._http.post(this.urlBase+"login", body, httpOption);
  }

  public logout(){
    this.isUsuarioLogeado = false;
    this.usuarioLogeado = new Usuario();
  }

  public logoutAfiliado(){
    this.isAfiliadoLogeado = false;
    this.afiliadoLogeado = new Afiliado();
  }

  /*validaciones*/
  public buscarAfiliadoEmail(email:string):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify({email:email});
    return this._http.post("http://localhost:3000/api/afiliados/buscar", body, httpOptions);
  }
}
