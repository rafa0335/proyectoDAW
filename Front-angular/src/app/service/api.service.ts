import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient,private router: Router) { }
  //LOGUEAR
  private urlLogin = 'http://127.0.0.1:8668/api/login';
  loguear(usuario: any): Observable<any> {
    // Configura las cabeceras HTTP (pueden variar según tus necesidades)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.urlLogin, usuario, { headers: headers });
  }

  //REGISTRAR
  private urlRegistro = 'http://127.0.0.1:8668/api/register';
  registro(nuevoUsuario: any): Observable<any> {
    // Configura las cabeceras HTTP (pueden variar según tus necesidades)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.urlRegistro, nuevoUsuario, { headers: headers });
  }

  //LISTAR LOS CURSOS
  private urlListadoCurso = 'http://127.0.0.1:8668/api/secrectAdmin';
  public getCursos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.urlListadoCurso,{ headers: headers });
  }

  //LISTAR LOS ALUMNOS
  private urlListadoAlumnos = 'http://127.0.0.1:8668/api/secrectAdminListadoUsuarios';
  public getAlumnos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.urlListadoAlumnos,{ headers: headers });
  }

  // PARA LISTAR LOS ALUMNOS DE UN CURSO
  private urlAlumnosCurso = 'http://127.0.0.1:8668/api/secrectAlumnosMatriculados/';
  getCursoPorId(cursoId: any): Observable<any> {
    const url = this.urlAlumnosCurso + cursoId;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url,{ headers: headers });
  }


  // ELIMINAR UN CURSO
  private urlEliminar = 'http://127.0.0.1:8668/api/secrectBorrarCurso/';
  eliminarCurso(cursoId: number): Observable<any> {
    const url = this.urlEliminar + cursoId;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url,{ headers: headers });
  }


  // PARA PINTAR LOS DATOS DE UN CURSO ANTES DE EDITARLO
  private urlBuscarCurso = 'http://127.0.0.1:8668/api/secrectAdmin/';
  buscarCurso(cursoId: number): Observable<any> {
    const url = this.urlBuscarCurso + cursoId;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url,{ headers: headers });
  }


  //PARA AÑADIR UN CURSO
  private urlAnadir = 'http://127.0.0.1:8668/api/secrectAdminAnadir';
  agregarCursoConFiltro(curso: any): Observable<any> {
    const token = localStorage.getItem('token');
      // Configura las cabeceras HTTP (pueden variar según tus necesidades)
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(this.urlAnadir, curso, { headers: headers });
  }


  //EDITAR UN CURSO
  private urlEditar = 'http://127.0.0.1:8668/api/secrectUpdateCurso';
  editarCurso(curso: any): Observable<any> {
    const token = localStorage.getItem('token');
    // Configura las cabeceras HTTP (pueden variar según tus necesidades)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(this.urlEditar, curso,{ headers: headers });
  }

  //FUNCION PARA PROTEGER LAS RUTAS
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

  //CERRAR SESION
  private urlDesloguear = 'http://127.0.0.1:8668/api/logout';
  desloguear():Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.urlDesloguear, '',{ headers: headers });
  }


  //MATRICULARSE EN UN CURSO
  private urlMatricularse = 'http://127.0.0.1:8668/api/matricular';
  matricularse (curso_id:any):Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.urlMatricularse, curso_id,{ headers: headers });
  }


  //RETIRAR LA MATRICULACION DE UN CURSO
  private urlDesMatricularse = 'http://127.0.0.1:8668/api/desmatricular/';
  desMatricularse (curso_id:number):Observable<any>{
    const url = this.urlDesMatricularse + curso_id;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url,{ headers: headers });
  }


  //COGER LOS CURSOS DE UN USUARIO (MI PERFIL)
  private urlCursosDelAlumno = 'http://127.0.0.1:8668/api/misCursos';
  getCursosAlumno ():Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.urlCursosDelAlumno,{ headers: headers });
  }


  //EDITAMOS LOS DATOS DEK USUARIO
  private urlEditarUsu = 'http://127.0.0.1:8668/api/updateUsuario';
  editarUsu(usuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    // Configura las cabeceras HTTP (pueden variar según tus necesidades)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(this.urlEditarUsu, usuario,{ headers: headers });
  }

  //BORRAMOS UN USUARIO
  private urlBorrarUsu = 'http://127.0.0.1:8668/api/secrectBorrarUsu/';
  borrarUsu (use_id:number):Observable<any>{
    const url = this.urlBorrarUsu + use_id;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url,{ headers: headers });
  }
}



