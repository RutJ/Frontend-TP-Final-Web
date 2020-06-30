import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pago } from '../models/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private urlBase:string="http://localhost:3000/api/pagos/";

  constructor(private _http:HttpClient) { }

  public getPagos():Observable<any>{
    return this._http.get(this.urlBase);
  }

  public addPago(pago: Pago):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(pago);
    return this._http.post(this.urlBase, body, httpOptions);
  }

  public deletePago(_id:string):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete(this.urlBase + _id ,httpOptions)
  }

  updatePago(pago: Pago):Observable<any>{
    
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    };
    var body = JSON.stringify(pago);
    return this._http.put(this.urlBase + pago._id, body ,httpOptions);
  }
}
