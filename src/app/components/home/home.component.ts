import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { NoticiaService } from 'src/app/service/noticia.service';
import { ServicioService } from 'src/app/service/servicio.service';
import { Noticia } from 'src/app/models/noticia';
import { Servicio } from 'src/app/models/servicio';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listaNoticias: Array<Noticia>;
  listaServicios: Array<Servicio>;
  constructor(
    public _servLogin: LoginService,
    private _servNoticia: NoticiaService,
    private _servServicio: ServicioService) {

    this.listaNoticias = new Array<Noticia>();
    this.listaServicios = new Array<Servicio>();

    this.getNoticias();
    this.getServicios();
  }

  public getNoticias(){
    this._servNoticia.getNoticias().subscribe(
      (result) => {
        this.listaNoticias = result;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  public getServicios(){
    this._servServicio.getServicios().subscribe(
      (result) => {
        this.listaServicios = result;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  ngOnInit(): void {
  }

}
