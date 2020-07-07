import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*Imports Externos*/
import { FormsModule } from '@angular/forms'; //directiva ng
import { HttpClientModule } from '@angular/common/http'; //cliente http
import { NgxDataTableModule} from "angular-9-datatable"; //angular datatable
import { AlifeFileToBase64Module } from 'alife-file-to-base64'; //convertir img a base64
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // animacion para los toastr
import { ToastrModule } from 'ngx-toastr'; // para mostrar los toastr
import { FacebookModule } from 'ngx-fb'; // para pubicar en facebook
 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { GestionUsuarioComponent } from './components/gestion/gestion-usuario/gestion-usuario.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/gestion/login/login.component';
import { LoginService } from './service/login.service';
import { GestionAfiliadoComponent } from './components/gestion/gestion-afiliado/gestion-afiliado.component';
import { GestionServicioComponent } from './components/gestion/gestion-servicio/gestion-servicio.component';
import { ServicioComponent } from './components/vista-usuario/servicio/servicio.component';
import { GestionNovedadComponent } from './components/gestion/gestion-novedad/gestion-novedad.component';
import { GestionPagoComponent } from './components/gestion/gestion-pago/gestion-pago.component';
import { GestionNoticiaComponent } from './components/gestion/gestion-noticia/gestion-noticia.component';
import { NovedadComponent } from './components/vista-usuario/novedad/novedad.component';
import { PagoComponent } from './components/vista-usuario/pago/pago.component';
import { PerfilComponent } from './components/vista-usuario/perfil/perfil.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    GestionUsuarioComponent,
    HomeComponent,
    LoginComponent,
    GestionAfiliadoComponent,
    GestionServicioComponent,
    ServicioComponent,
    GestionNovedadComponent,
    GestionPagoComponent,
    GestionNoticiaComponent,
    NovedadComponent,
    PagoComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxDataTableModule,
    AlifeFileToBase64Module,
    BrowserAnimationsModule,
    FacebookModule.forRoot(),
    ToastrModule.forRoot({
      timeOut:1000,
      positionClass: 'toast-top-left'
    })
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
