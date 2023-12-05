import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CursosListadoComponent } from './cursos-listado/cursos-listado.component';
import { AlumnosCursoComponent } from './alumnos-curso/alumnos-curso.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ApiService } from './service/api.service';
import { CursosAlumnosComponent } from './cursos-alumnos/cursos-alumnos.component';
import {ListadoDeAlumnosComponent} from "./listado-de-alumnos/listado-de-alumnos.component";

const routes: Routes = [
  //LOGIN
  {path:'',component: LoginComponent},
  //REGISTRO
  {path:'registro',component:RegistroComponent},
  {path:'cursos',component:CursosListadoComponent,canActivate: [ApiService]},
  {path:'ListadoDeAlumnos',component:ListadoDeAlumnosComponent,canActivate: [ApiService]},
  {path:'curso/:id/:nombre',component:AlumnosCursoComponent,canActivate: [ApiService]},
  {path: 'inicio', component: HomeComponent,canActivate: [ApiService]},
  {path:'inicio/miPerfil',component:CursosAlumnosComponent,canActivate: [ApiService]},
  {path: '**',component: LoginComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
