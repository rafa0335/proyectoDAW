<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\MatriculacionController;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Facades\JWTAuth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//registro y logi de usuarios

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware(['jwt.auth'])->group(function () {
    //CERRAR SESION
    Route::post('logout', [AuthController::class, 'logout']);

    //CRUD ADMINISTRADOR
    Route::get('secrectAdmin', [CursoController::class, 'index']); //LISTADO
    Route::post('secrectAdminAnadir', [CursoController::class, 'agregarCursoConFltro']);//AÑADIR
    Route::get('secrectAdmin/{id}', [CursoController::class, 'cursoPorId']);//PINTA LOS DATOS DE UN CURSO ESPECIFICO
    Route::put('secrectUpdateCurso', [CursoController::class, 'updateCurso']);//EDITAR UN CURSO
    Route::delete('secrectBorrarCurso/{id}', [CursoController::class, 'borrarCurso']);//BORRAR CURSO
    Route::get('secrectAlumnosMatriculados/{id}', [CursoController::class, 'usuariosEnCurso']);//LISTADO DE USUARIOS EN UN CURSO

    //CRUD TABLA MATRICULACIONES
    Route::post('matricular', [MatriculacionController::class, 'matricularAlumno']);
    Route::delete('desmatricular/{id}', [MatriculacionController::class, 'borrarMatriculacion']);

    //CRUD DE USUARIO
    Route::get('secrectAdminListadoUsuarios', [AuthController::class, 'index']);//LISTADO DE USUARIOS
    Route::put('updateUsuario', [AuthController::class, 'editarUsuario']);//EDITAR UN USUARIO
    Route::get('datosUsuario', [AuthController::class, 'datosUsuario']);//DEVOLVER LOS DATOS DEL USUARIO
    Route::get('misCursos', [AuthController::class, 'cursosMatriculados']);//LISTADO DE  LOS CURSOS DE UN ALUMMNO
    Route::delete('secrectBorrarUsu/{id}', [AuthController::class, 'borrarUsu']); //BORRAR UN USUARIO

});
