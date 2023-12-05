import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../service/api.service';

@Component({
  selector: 'app-alumnos-curso',
  styleUrls: ['./alumnos-curso.component.css'],
  templateUrl: './alumnos-curso.component.html',
})

export class AlumnosCursoComponent implements OnInit {
  constructor (private route: ActivatedRoute,private ApiService: ApiService){}

  cursoId: number = 0;
  cursoNombre: string = "";
  alumnosMatriculados:any[]=[];
  // Obtiene la fecha actual
   fechaActual = new Date();
  // Obtiene componentes de la fecha
   dia = this.fechaActual.getDate();
   mes = this.fechaActual.getMonth() + 1; // Los meses comienzan desde 0, así que sumamos 1
   anio = this.fechaActual.getFullYear();
  // Formatea la fecha como DD/MM/AAAA
   fechaFormateada = this.dia + '/' + this.mes + '/' + this.anio;
  ngOnInit(): void {
    //cogemos los datos que vienen en el get
    const idParam = this.route.snapshot.paramMap.get('id');
    const nombreParam = this.route.snapshot.paramMap.get('nombre');
    if (idParam !== null && nombreParam !== null) {
      this.cursoId = +idParam;
      this.cursoNombre = nombreParam;
    }
    this.getAlumnosMatriculados();
  }
  //obtener los alumnos
  getAlumnosMatriculados() {
    this.ApiService.getCursoPorId(this.cursoId).subscribe((data) => {
      this.alumnosMatriculados = data.usuarios;
    });
  }
  //funcion para filtrar con primegn
  onInputChange(event: any, dt: any) {
    const inputValue = event.target.value;
    console.log(inputValue)
    dt.filterGlobal(inputValue, 'contains');
  }




}
