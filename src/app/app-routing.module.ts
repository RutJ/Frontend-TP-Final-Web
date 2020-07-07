import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionAfiliadoComponent } from './components/gestion/gestion-afiliado/gestion-afiliado.component';
import { GestionUsuarioComponent } from './components/gestion/gestion-usuario/gestion-usuario.component';
import { GestionServicioComponent } from './components/gestion/gestion-servicio/gestion-servicio.component';
import { LoginComponent } from './components/gestion/login/login.component';

import { NovedadComponent } from './components/vista-usuario/novedad/novedad.component';
import { ServicioComponent } from './components/vista-usuario/servicio/servicio.component';
import { GestionNovedadComponent } from './components/gestion/gestion-novedad/gestion-novedad.component';
import { GestionPagoComponent } from './components/gestion/gestion-pago/gestion-pago.component';
import { GestionNoticiaComponent } from './components/gestion/gestion-noticia/gestion-noticia.component';
import { PagoComponent } from './components/vista-usuario/pago/pago.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'gestion-usuario', component: GestionUsuarioComponent },
  { path: 'gestion-afiliado', component: GestionAfiliadoComponent},
  { path: 'gestion-servicio', component: GestionServicioComponent},
  { path: 'gestion-novedad', component:GestionNovedadComponent},
  { path: 'gestion-noticia', component:GestionNoticiaComponent},
  { path: 'gestion-pago', component: GestionPagoComponent},
  { path: 'vista-servicio', component: ServicioComponent},
  { path: 'vista-pago', component: PagoComponent},
  { path: 'vista-novedad', component: NovedadComponent},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch:'full',redirectTo:'home' },
  { path: '', pathMatch:'full',redirectTo:'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
