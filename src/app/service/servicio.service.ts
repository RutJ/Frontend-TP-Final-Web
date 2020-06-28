import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servicio } from 'src/app/models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private urlBase:string="http://localhost:3000/api/servicios/";

  constructor(private _http:HttpClient) { }

  public getServicios():Observable<any>{
    return this._http.get(this.urlBase);
  }

  public crearServicio(servicioCrear:Servicio):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(servicioCrear);
    return this._http.post(this.urlBase, body, httpOptions);
  }

  public updateServicio(servicioModificar:Servicio):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(servicioModificar);
    return this._http.put(this.urlBase+servicioModificar._id, body, httpOptions);
  }

}
