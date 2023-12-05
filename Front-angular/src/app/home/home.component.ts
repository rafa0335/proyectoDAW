import { Component, OnInit } from '@angular/core';
import { ApiService } from './../service/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private ApiService: ApiService,private rutas:Router){}

  cursos: any [] = [];
  id_curso: any = {};
  token: any;
  datosUsuario: string = "";
  datos: any  = {};

  contenido:string="";
  nombreCursoContenido:string="";
  mostrarContenidoCurso=false;

  //rediriguimos la paguina en caso de que sean administrador o usuario
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.datos = JSON.parse(atob(this.token.split('.')[1]));
    if(this.token) {
      if (this.datos.rol == "cliente") {
        this.llenarCursos();
      } else if (this.datos.rol == "admin") {
        this.rutas.navigate(['cursos']);
      }
    }else {
      this.rutas.navigate(['']);
    }
  }
  //mostramos los cursos
  llenarCursos (){
    this.ApiService.getCursos().subscribe((data) => {
      this.cursos = data.data;
    });
  }
  //hacemos una matriculacion en el curso si el curso tiene plazas
  matricularse (id:any){
    this.id_curso={
      curso_id:id
    }
    if (confirm('¿Estás seguro de que quieres matricularte en este curso ?')) {
      this.ApiService.matricularse(this.id_curso).subscribe(response => {
        if(response.message){
          alert(response.message);
          this.llenarCursos();
        }
      }, error => {
        if (error.status === 404) {
          alert("ya esta matriculado en este curso");
        }else if(error.status === 400){
          alert("no ahi plazas en este curso");
        } else {
          alert("ocurrio un error al matricularse")
        }
      });
    }
  }
  majenarContenido(){
    if(this.mostrarContenidoCurso){
      this.mostrarContenidoCurso=false;
    }else if(!this.mostrarContenidoCurso) {
      this.mostrarContenidoCurso = true;
    }
  }
  mostrarContenido(contenidoCurso: string,nombreCurso:string) {
    //console.log("entra, " + contenidoCurso);
    if(contenidoCurso != null){
      this.contenido= contenidoCurso;
    }else {
      this.contenido = "Este curso aun no tiene contenido, sera añadido proximamente";
    }
    //console.log("mi contenido " + this.contenido);
    //console.log(this.mostrarContenidoCurso);
    this.nombreCursoContenido=nombreCurso;
    this.majenarContenido();
  }
  //funcion para filtrar con primegn
  onInputChange(event: any, dt: any) {
    const inputValue = event.target.value;
    //console.log(inputValue)
    dt.filterGlobal(inputValue, 'contains');
  }
}
