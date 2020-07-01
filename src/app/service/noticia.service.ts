import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from 'src/app/models/noticia';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  private urlBase:string = "http://localhost:3000/api/noticias/";

  constructor(private _http:HttpClient) { }

  public getNoticias():Observable<any>{
    return this._http.get(this.urlBase);
  }

  public createNoticia(noticiaCrear:Noticia):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(noticiaCrear);
    return this._http.post(this.urlBase, body, httpOptions);
  }

  public updateNoticia(noticiaModificar:Noticia):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    }
    var body = JSON.stringify(noticiaModificar);
    return this._http.put(this.urlBase+noticiaModificar._id, body, httpOptions);
  }
}
