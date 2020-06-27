import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*Imports Externos*/
import { FormsModule } from '@angular/forms'; //directiva ng
import { HttpClientModule } from '@angular/common/http'; //cliente http
import { NgxDataTableModule} from "angular-9-datatable"; //angular datatable

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { GestionUsuarioComponent } from './components/gestion/gestion-usuario/gestion-usuario.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/gestion/login/login.component';
import { LoginService } from './service/login.service';
import { GestionAfiliadoComponent } from './components/gestion/gestion-afiliado/gestion-afiliado.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    GestionUsuarioComponent,
    HomeComponent,
    LoginComponent,
    GestionAfiliadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxDataTableModule,
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
