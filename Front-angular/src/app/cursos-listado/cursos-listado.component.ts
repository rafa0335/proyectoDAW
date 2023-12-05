import { Router } from '@angular/router';
import { ApiService } from './../service/api.service';
import { Component, OnInit } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-cursos-listado',
  templateUrl: './cursos-listado.component.html',
  styleUrls: ['./cursos-listado.component.css']
})
export class CursosListadoComponent implements OnInit {
  constructor (private ApiService: ApiService, private rutas:Router){}
  cursos: any [] = [];
  cursoAeditar: any  = {};
  mostrar = false; // Variable para mostrar u ocultar el formulario
  editar=false;
  nuevoNombre: string = "";
  nuevoPrecio: number = 0;
  nuevasPlazas: number = 0;
  nuevaDescripcion:string = "";
  nuevoContenido:string="";
  errorMessage: string = '';
  datos: any  = {};
  token: any;
  nuevoCurso: any = {};
  nuevoCursoEditado: any = {};
  //variables para manejar el contenido
  contenido:string="";
  nombreCursoContenido:string="";
  mostrarContenidoCurso=false;
  ngOnInit(): void {
    //protegemos para que si no eres admin no puedas entrar
    this.token = localStorage.getItem('token');
    this.datos = JSON.parse(atob(this.token.split('.')[1]));
    if(this.token) {
      if (this.datos.rol == "admin") {
        this.llenarCursos();
      }else if(this.datos.rol == "cliente"){
        this.rutas.navigate(['']);
      }
    }else {
      this.rutas.navigate(['']);
    }
  }
  //recogemos todos los cursos
  llenarCursos (){
    this.ApiService.getCursos().subscribe((data) => {
      this.cursos = data.data;
    });
  }

  //funcion que cuando le das al boton de editar un curso te muestra el formulario y pinta los datos del curso correspondiente
  modificarCurso (id:number){
    this.mostrarFormulario();
    this.editar=true;
    this.ApiService.buscarCurso(id).subscribe((data) => {
      this.cursoAeditar = data.data;
      this.nuevoNombre = this.cursoAeditar.nombreCurso;
      this.nuevasPlazas = this.cursoAeditar.plazas;
      this.nuevoPrecio = this.cursoAeditar.precio;
      this.nuevaDescripcion = this.cursoAeditar.descripcion;
      this.nuevoContenido=this.cursoAeditar.contenido;
    });
  }
  //eliminamos el curso si no tiene matriculaciones
  eliminarCurso(cursoId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.ApiService.eliminarCurso(cursoId).subscribe((response) => {
        if(response.data){
          alert("curso eliminado correctamente");
          this.cursos = response.data;
        } else{
          alert('No se puede eliminar porque tiene matriculaciones');
        }
      },(error) => {
          alert('error al eliminar el curso');
        }
      );
    }
  }
  //funcion para limpiar los campos
  limpiaCampos(){
    this.nuevoNombre = "";
    this.nuevoPrecio = 0;
    this.nuevasPlazas=0;
    this.nuevaDescripcion="";
    this.errorMessage="";
    this.nuevoContenido="";
  }

  //si el formulario esta oculto lo activa si esta activo lo oculta
  mostrarFormulario (){
    if(this.mostrar){
      this.limpiaCampos();
      this.mostrar=false;
    }else{
      this.mostrar=true;
    }
  }
  //agregamos un nuevo curso si los campos vienen rellenos
  agregarCurso() {
    this.nuevoCurso={
      nombreCurso: this.nuevoNombre,
      precio: this.nuevoPrecio,
      plazas: this.nuevasPlazas,
      descripcion: this.nuevaDescripcion,
      contenido:this.nuevoContenido
    }
    this.ApiService.agregarCursoConFiltro(this.nuevoCurso).subscribe(response => {
      this.llenarCursos();
      this.mostrarFormulario();
    }, error => {
      if (error.status === 400) {
         if(error.error.errors.nombreCurso){
           this.errorMessage="el nombre del curso es obligatorio"
         }
      } else {
        this.errorMessage = 'Ocurrió un error al agregar el curso.';
      }
    });
  }

  //funcion cuando le da al boton editar dentro del formulario
  editarCurso(){
    this.nuevoCursoEditado={
      id:this.cursoAeditar.id,
      nombreCurso: this.nuevoNombre,
      precio: this.nuevoPrecio,
      plazas: this.nuevasPlazas,
      descripcion:this.nuevaDescripcion,
      contenido:this.nuevoContenido
    }
    this.ApiService.editarCurso(this.nuevoCursoEditado).subscribe(response => {
      this.llenarCursos();
      this.mostrarFormulario();
    }, error => {
      if (error.status === 400) {
        console.log(error.error);
        if( error.error.errors && error.error.errors.nombreCurso){
          //console.log("entra nombre");
          this.errorMessage="Modifique el nombre del curso"
        }else{
          console.log("entra");
          this.errorMessage=error.error.message;
        }
      }else {
        this.errorMessage = "ocurrio un error desconocido "
      }
    });
  }
  manejaFormulario(){
    this.editar=false;
    this.mostrarFormulario();
  }
  majenarContenido(){
    if(this.mostrarContenidoCurso){
      this.mostrarContenidoCurso=false;
    }else if(!this.mostrarContenidoCurso) {
      this.mostrarContenidoCurso = true;
    }
  }
  mostrarContenido(contenidoCurso: string,nombreCurso:string) {
    console.log("entra, " + contenidoCurso);
    if(contenidoCurso != null){
      this.contenido= contenidoCurso;
    }else {
      this.contenido = "Este curso aun no tiene contenido, sera añadido proximamente";
    }
   // console.log("mi contenido " + this.contenido);
   // console.log(this.mostrarContenidoCurso);
    this.nombreCursoContenido=nombreCurso;
    this.majenarContenido();
  }
  //expresiones regulares para validar
  validarEnteroPositivo(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    // Expresión regular para números enteros positivos
    const regex = /^[0-9]*[1-9][0-9]*$/;
    if (!regex.test(valor)) {
      // Si el valor no es un número entero positivo, elimina los caracteres no válidos
      input.value = valor.replace(/[^0-9]*/g, '');
    }
  }
  validarDecimalPositivo(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    // Expresión regular para números decimales positivos
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(valor)) {
      // Si el valor no es un número decimal positivo, elimina los caracteres no válidos
      input.value = valor.replace(/[^0-9.]*/g, '');
      // Asegúrate de que solo haya un punto decimal en el valor
      const matches = input.value.match(/\./g);
      if (matches && matches.length > 1) {
        input.value = input.value.slice(0, input.value.lastIndexOf('.'));
      }
    }
  }
  //cierra sesion, destruye el token y redirigue al login
  desloguearse(){
    this.ApiService.desloguear().subscribe(response => {
      if(response.exito){
        this.rutas.navigate(['']);
        localStorage.removeItem('token');
      }
    }, error => {
      if (error.status === 400) {
        this.errorMessage = error.error.message;
      } else {
        // Maneja otros errores aquí
        this.errorMessage = 'Ocurrió un error al desloguearse';
      }
    });
  }
  //lleva a la paguina que se muestran los alumnos registrados
  listadoUsuarios(){
    this.rutas.navigate(['ListadoDeAlumnos']);
  }
  //funcion para filtrar con primeGN
  onInputChange(event: any, dt: any) {
    const inputValue = event.target.value;
    //console.log(inputValue)
    dt.filterGlobal(inputValue, 'contains');
  }
}
