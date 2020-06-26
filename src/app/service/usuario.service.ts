import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlBase:string="http://localhost:3000/api/usuarios/";
  constructor(private _http:HttpClient) {

  }

  public crearUsuario(usuarioCrear:Usuario):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(usuarioCrear);
    return this._http.post(this.urlBase, body, httpOptions);
  }

  public modificarUsuario(usuarioModificar:Usuario):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(usuarioModificar);
    return this._http.put(this.urlBase+usuarioModificar._id, body, httpOptions);
  }

  public getUsuarios():Observable<any>{
    return this._http.get(this.urlBase);
  }



  /*Validaciones*/
  public buscarUsuario(usuarioNombre:string):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify({usuario:usuarioNombre});
    return this._http.post(this.urlBase+"buscar", body, httpOptions);
  }
}
