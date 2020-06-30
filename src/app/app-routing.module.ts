import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionAfiliadoComponent } from './components/gestion/gestion-afiliado/gestion-afiliado.component';
import { GestionUsuarioComponent } from './components/gestion/gestion-usuario/gestion-usuario.component';
import { GestionServicioComponent } from './components/gestion/gestion-servicio/gestion-servicio.component';
import { LoginComponent } from './components/gestion/login/login.component';


import { ServicioComponent } from './components/vista-usuario/servicio/servicio.component';
import { GestionNovedadComponent } from './components/gestion/gestion-novedad/gestion-novedad.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'gestion-usuario', component: GestionUsuarioComponent },
  { path: 'gestion-afiliado', component: GestionAfiliadoComponent},
  { path: 'gestion-servicio', component: GestionServicioComponent},
  { path: 'gestion-novedad', component:GestionNovedadComponent},
  { path: 'vista-servicio', component: ServicioComponent},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch:'full',redirectTo:'home' },
  { path: '', pathMatch:'full',redirectTo:'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
