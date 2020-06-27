import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionAfiliadoComponent } from './components/gestion/gestion-afiliado/gestion-afiliado.component';
import { GestionUsuarioComponent } from './components/gestion/gestion-usuario/gestion-usuario.component';
import { LoginComponent } from './components/gestion/login/login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'gestion-usuario', component: GestionUsuarioComponent },
  { path: 'gestion-afiliado', component: GestionAfiliadoComponent},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch:'full',redirectTo:'home' },
  { path: '', pathMatch:'full',redirectTo:'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
