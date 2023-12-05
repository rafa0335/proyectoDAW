import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './../service/api.service';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  constructor(private rutas: Router,private ApiService: ApiService){}
  dni:string = "";
  apellidos="";
  nombre:string = "";
  email:string = "";
  telefono:string = "";
  password:string = "";
  reppassword:string="";
  nuevoUsuario: any = {};
  errorMessage: string = '';
  errorEmail:string='';
  errorDni:string='';
  errorNombre="";
  errorApellidos="";
  errorPasaword="";
  errorTelefono:string="";
  errorRepetirPasword="";
  correcto:boolean = true;

  //limpiamos los errores
  limpiarErrores(){
    this.errorDni='';
    this.errorNombre="";
    this.errorApellidos="";
    this.errorEmail="";
    this.errorPasaword="";
    this.errorRepetirPasword=""
    this.errorTelefono="";
  }
  //validamos los campos y si son correctos nos registramos
  registrarse(){
    this.limpiarErrores();

    if(this.dni == ""){
      this.errorDni = "el dni es obligatorio";
      this.correcto =false;
    }else if (!this.validateDNI()){
      this.correcto=false;
    }
    if(this.nombre == ""){
      this.errorNombre = "el nombre es obligatorio";
      this.correcto=false;
    }
    if(this.apellidos == ""){
      this.errorApellidos = "los apellidos son obligatorios";
      this.correcto=false;
    }
    if(this.email == ""){
      this.errorEmail = "el correo es obligatorio";
      this.correcto=false;
    }else  if(!this.validateEmail()){
      this.correcto=false;
    }
    if(this.telefono.length != 9){
      this.errorTelefono = "el numero de telefono tiene que tener 9 digitos";
      this.correcto=false;
    }
    if(this.password == ""){
      this.errorPasaword = "la contraseña es obligatoria";
      this.correcto=false;
    }
    if(this.reppassword == ""){
      this.errorRepetirPasword = "confirmar la contraseña";
      this.correcto=false;
    }
    if(this.reppassword != this.password) {
      this.errorRepetirPasword=" las contraseñas no coinciden";
      this.correcto=false;
    }
    if(this.correcto){
      this.nuevoUsuario={
        dni:this.dni,
        name:this.nombre,
        apellidos:this.apellidos,
        email: this.email,
        telefono: this.telefono,
        password: this.password
      }
        this.ApiService.registro(this.nuevoUsuario).subscribe(response => {
          if(response.exito){
            alert("¡Se contemplo el registro con exito, redirigiendo al login!");
            this.rutas.navigate(['']);
          }else{
            //console.log(response);
            this.errorMessage = response.mensaje;
          }
        }, error => {
          if (error.status === 400) {
            if(error.error.error['email']){
              this.errorEmail="El email ya esta en uso";
            }
            if(error.error.error['dni']){
              this.errorDni="El dni ya esta en uso";
            }
          }else {
            this.errorMessage = "error al registrarse"
          }
        });
    }
    this.correcto = true;
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
      this.telefono = input.value;
    }
  }
   validateEmail(){
    // Get our input reference.
    var email = this.email;
    // Define our regular expression.
    var validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    // Using test we can check if the text match the pattern
    if( validEmail.test(email) ){
      return true;
    }else{
      this.errorEmail="El email no tiene el formato correcto"
      return false;
    }
  }

  validateDNI() {
    // Get our input reference.
    const dni = this.dni;
    // Define our regular expression.
    const validDNIFormat = /^\d{8}[a-zA-Z]$/i;
    // Check the format
    if (!validDNIFormat.test(dni)) {
      this.errorDni = "El DNI no tiene el formato correcto";
      return false;
    }
    // Extract the number and letter parts
    const dniNumber = dni.slice(0, 8);
    const dniLetter = dni.slice(8).toUpperCase();
    // Define a function to calculate the letter for a given number
    function calculateLetter(number: string): string {
      const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
      const index = parseInt(number, 10) % 23;
      return letters.charAt(index);
    }
    // Check if the calculated letter matches the provided letter
    if (calculateLetter(dniNumber) !== dniLetter) {
      this.errorDni = "La letra del DNI no es correcta";
      return false;
    }
    return true;
  }
}
