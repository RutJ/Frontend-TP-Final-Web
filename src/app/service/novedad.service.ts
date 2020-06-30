import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Novedad } from '../models/novedad';

@Injectable({
  providedIn: 'root'
})
export class NovedadService {

  direccion: string = "http://localhost:3000/api/novedades/";

  constructor(private _http:HttpClient) { }

  getNovedades():Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.get(this.direccion,httpOptions);
  }

  addNovedad(novedad:Novedad):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    var body = JSON.stringify(novedad);
    return this._http.post(this.direccion,body,httpOptions);
  }

  deleteNovedad(novedad:Novedad):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.delete(this.direccion+novedad._id,httpOptions);
  }

  editNovedad(novedad:Novedad):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    var body = JSON.stringify(novedad);
    return this._http.put(this.direccion+novedad._id,body,httpOptions);
  }

  /*
  getNovedad(id:string):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.get(this.direccion+id,httpOptions);
  }
  */
}
