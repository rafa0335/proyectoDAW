<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});

/*funcion que prueba la conexion a la base de datos*/

Route::get('prueba', function () {
    try {
        DB::connection()->getPdo();
        echo "Conexión exitosa a la base de datos.";
    } catch (\Exception $e) {
        die("No se pudo conectar a la base de datos: " . $e->getMessage());
    }
});


