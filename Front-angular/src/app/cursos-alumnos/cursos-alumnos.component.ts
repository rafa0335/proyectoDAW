import { Component, OnInit } from '@angular/core';
import { ApiService } from './../service/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cursos-alumnos',
  templateUrl: './cursos-alumnos.component.html',
  //styleUrls: ['./../cursos-listado/cursos-listado.component.css']
  styleUrls: ['./cursos-alumnos.component.css']
})
export class CursosAlumnosComponent implements OnInit{
  constructor(private ApiService: ApiService,private rutas:Router){}

  mostrarTabla=true;
  cursos: any [] = [];
  errorMessage: string = "";
  errorEmail: string = '';
  errordni: string = '';
  mostrar=false;
  dniUsuario:string="";
  nombreUsuario:string="";
  apellidosUsuario:string="";
  correoUsuario:string="";
  telefono:string="";
  id_usu:number=0;
  passwordUsuario:string="";
  datosToken: any  = {};
  usuarioEditado: any = {};

  contenido:string="";
  nombreCursoContenido:string="";
  mostrarContenidoCurso=false;
  ngOnInit(): void {
    //Comprobamos quien accede y rediriguimos y recogemos los datos
    this.cursosAlumno();
    this.datosToken = localStorage.getItem('token');
    this.datosToken = JSON.parse(atob(this.datosToken.split('.')[1]));
    if(this.datosToken) {
      console.log(this.datosToken);
      if (this.datosToken.rol == "cliente") {
        this.nombreUsuario=this.datosToken.nombre;
        this.apellidosUsuario = this.datosToken.apellidos;
        this.correoUsuario=this.datosToken.email;
        this.id_usu = this.datosToken.id_usu;
        this.dniUsuario =this.datosToken.dni;
        this.telefono = this.datosToken.telefono;
      } else if (this.datosToken.rol == "admin") {
        this.rutas.navigate(['cursos']);
      }
    }else {
      this.rutas.navigate(['']);
    }
  }

  //obtenemos los datos de los cursos del alumno registrado
  cursosAlumno(){
    this.ApiService.getCursosAlumno().subscribe((data) => {
      if(data.cursos.length > 0){
        this.cursos = data.cursos;
        this.mostrarTabla=true;
      }else {
        this.mostrarTabla=false;
      }
    });
  }

  editarPerfil(){
    this.usuarioEditado={
      dni:this.dniUsuario,
      name: this.nombreUsuario,
      apellidos: this.apellidosUsuario,
      email: this.correoUsuario,
      telefono: this.telefono,
      password: this.passwordUsuario
    }
    this.ApiService.editarUsu(this.usuarioEditado).subscribe(response => {

      this.datosToken.nombre = this.nombreUsuario;
      this.datosToken.apellidos = this.apellidosUsuario;
      this.datosToken.email = this.correoUsuario;
      this.datosToken.id_usu = this.id_usu;
      console.log("correo dps de editar"+this.correoUsuario);
      this.datosToken.dni =this.dniUsuario;
      this.datosToken.telefono =this.telefono;

      alert("el usuario se edito correctamente!")
      this.mostrarFormulario();
    }, error => {
      if (error.status === 400 ) {
        console.log("entra en el estatus 400")
       if(error.error.errors['dni']){
         console.log(("existe el error del dni"))
         this.errordni = "el dni no es valido o ya esta en uso";
       }
       if(this.validateEmail()){
         if(error.error.errors['email']){
           console.log("existe el error del email ")
          this.errorEmail = "el email ya esta en uso";
         }
       }
      }else {
        this.errorMessage = 'Ocurrió un error al actualizar el usuario.';
      }
    });
  }
  //limpiamos los campos
  limpiaCampos(){
    this.errorMessage="";
    this.errorEmail="";
    this.errordni="";
  }

  //administramos el formulario si esta oculto lo muestra y si esta visible lo esconde
  mostrarFormulario (){
    if(this.mostrar){
      this.mostrar=false;
      this.limpiaCampos();
    }else{
      this.nombreUsuario=this.datosToken.nombre;
      this.apellidosUsuario = this.datosToken.apellidos;
      this.correoUsuario=this.datosToken.email;
      this.id_usu = this.datosToken.id_usu;
      this.dniUsuario =this.datosToken.dni;
      this.telefono = this.datosToken.telefono;

      this.mostrar=true;
    }
  }

  // borramos nuestra inscripcion de un curso
  desmatricularse(id:number){
    //console.log(id);
    if (confirm('¿Estás seguro de que quieres matricularte en este curso ?')) {
      this.ApiService.desMatricularse(id).subscribe(response => {
        //console.log(' desmatriculado correctamente', response);
        if(response.message){
          alert(response.message);
          this.cursosAlumno();
        }
      }, error => {
        if (error.status === 404) {

          alert("no esta matriculado en este curso")
        }else {
          // Maneja otros errores aquí
          alert("ocurrio un error al desmatricularse")
        }
      });
    }
  }
  //cerramos sesion y borramos el token del localstorage
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
        this.errorMessage = 'Ocurrió un error al desloguearse';
      }
    });
  }
  //borramos la cuenta si no tiene matriculaciones
  borrarCuenta(){
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta ?')) {
      this.ApiService.borrarUsu(this.datosToken.usuarioId).subscribe((response) => {
          if(response.data){
            alert("usuario eliminado correctamente");
            this.rutas.navigate(['']);
          } else{
            alert('No se puede eliminar porque tiene matriculaciones');
          }
        },(error) => {
          alert('no tienes permisos para eliminar esta cuenta');
        }
      );
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
  //expresion regular para validar el email
  validateEmail(){
    var email = this.correoUsuario;
    var validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if(email == ""){
      this.errorMessage="El email es obligatorio";
      return false;
    }else if( validEmail.test(email) ){
      return true;
    }else{
      this.errorEmail="El email no tiene el formato correcto";
      return false;
    }
  }
  //funcion de filtro con primeGN
  onInputChange(event: any, dt: any) {
    const inputValue = event.target.value;
    console.log(inputValue)
    dt.filterGlobal(inputValue, 'contains');
  }
}


