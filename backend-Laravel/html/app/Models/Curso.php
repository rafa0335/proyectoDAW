<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{


    protected $fillable = [
        'nombreCurso',
        'plazas',
        'precio',
        'descripcion',
        'contenido'
    ];



    public function matriculaciones()
    {
        return $this->hasMany(Matriculacion::class);
    }

    public function usuariosMatriculados()
    {
        return $this->belongsToMany(User::class, 'matriculaciones', 'curso_id', 'user_id');
    }

}

