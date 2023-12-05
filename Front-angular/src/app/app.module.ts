import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { ButtonModule } from 'primeng/button';
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {SliderModule} from "primeng/slider";
import {ProgressBarModule} from "primeng/progressbar";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CursosListadoComponent } from './cursos-listado/cursos-listado.component';
import{HttpClientModule} from '@angular/common/http';
import { AlumnosCursoComponent } from './alumnos-curso/alumnos-curso.component'
import { FormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { CursosAlumnosComponent } from './cursos-alumnos/cursos-alumnos.component';
import { PiePaguinaComponent } from './pie-paguina/pie-paguina.component';
import { ListadoDeAlumnosComponent } from './listado-de-alumnos/listado-de-alumnos.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CursosListadoComponent,
    AlumnosCursoComponent,
    RegistroComponent,
    LoginComponent,
    CursosAlumnosComponent,
    PiePaguinaComponent,
    ListadoDeAlumnosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    TagModule,
    SliderModule,
    ProgressBarModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
