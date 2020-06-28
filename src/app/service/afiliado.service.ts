import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Afiliado } from '../models/afiliado';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AfiliadoService {

  urlBase: string = 'http://localhost:3000/api/afiliados/';

  constructor(private _http: HttpClient) { }

  obtenerAfiliados():Observable<any>{
    return this._http.get(this.urlBase);
  }

  agregarAfiliado(afiliado: Afiliado){
    return this._http.post(this.urlBase, afiliado);
  }

  actualizarAfiliado(afiliado: Afiliado){
    return this._http.put(this.urlBase + `${afiliado._id}`, afiliado);
  }

  eliminarAfiliado(_id: string){
    return this._http.delete(this.urlBase + `${_id}`);
  }
}
