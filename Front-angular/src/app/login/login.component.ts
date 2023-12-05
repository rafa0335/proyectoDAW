import { Router } from '@angular/router';
import { ApiService } from './../service/api.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  email:string = "";
  password:string = "";
  errorMessage: string = '';
  errorEmail: string = '';
  errorPassword: string = '';
  usuario: any = {};
  constructor (private ApiService: ApiService, private rutas:Router){}
  //si los campos son correctos iniciamos sesion y guardamos el token en el localstorage
  loguear(){
    this.limpiarErrores();
    this.usuario={
      email:this.email,
      password: this.password,
    }
    this.ApiService.loguear(this.usuario).subscribe(response => {
      if(response.exito){
        localStorage.setItem('token', response.token);
        this.rutas.navigate(['/inicio']);
      }
    }, error => {
      if (error.status === 400) {
        if(this.email == ""){
          this.errorEmail="el email es obligatorio";
        }
        if (this.errorPassword == ""){
          this.errorPassword = "contraseña obligatoria";
        }
      } else if (error.status === 401) {
        this.errorMessage = 'credenciales incorrectas';
      }else {
        this.errorMessage = 'Ocurrió un error al loguearse';
      }
    });
  }
//limpiamos los campos
  limpiarErrores(){
    this.errorEmail="";
    this.errorPassword="";
    this.errorMessage="";

  }
}
