import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from './../service/api.service';
@Component({
  selector: 'app-listado-de-alumnos',
  templateUrl: './listado-de-alumnos.component.html',
  styleUrls: ['./listado-de-alumnos.component.css']
})
export class ListadoDeAlumnosComponent implements OnInit {
  constructor(private apiService: ApiService, private rutas: Router) { }
  usuarios: any[] = [];
  datos: any = {};
  token: any;

  // Obtiene la fecha actual
  fechaActual = new Date();
  // Obtiene componentes de la fecha
  dia = this.fechaActual.getDate();
  mes = this.fechaActual.getMonth() + 1; // Los meses comienzan desde 0, así que sumamos 1
  anio = this.fechaActual.getFullYear();
  // Formatea la fecha como DD/MM/AAAA
  fechaFormateada = this.dia + '/' + this.mes + '/' + this.anio;
  //protegemos la paguina àra que si no eres admin no puedas entrar
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.datos = JSON.parse(atob(this.token.split('.')[1]));
    if (this.token) {
      if (this.datos.rol == "admin") {
        this.llenarUsus();
      } else if (this.datos.rol == "cliente") {
        this.rutas.navigate(['']);
      }
    } else {
      this.rutas.navigate(['']);
    }
  }
  //sacamos los alumnos
  llenarUsus() {
    this.apiService.getAlumnos().subscribe((data) => {
      this.usuarios = data.data;
    });
  }
  //eliminamos el usuario si no tiene matriculaciones hechas
  eliminarUsu(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar a este usuario?')) {
      this.apiService.borrarUsu(id).subscribe(
        (response) => {
          if (response.data) {
            alert("Usuario eliminado correctamente");
            this.llenarUsus();
          } else {
            alert('No se puede eliminar porque tiene matriculaciones');
          }
        },
        (error) => {
          alert('Error al eliminar el usuario');
        }
      );
    }
  }
  //funcion para filtrar con primeGN
  onInputChange(event: any, dt: any) {
    const inputValue = event.target.value;
    console.log(inputValue)
    dt.filterGlobal(inputValue, 'contains');
  }
}
