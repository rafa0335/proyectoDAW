<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatriculacionE extends Model
{
    protected $table = 'matriculaciones';

    protected $fillable = [
        'curso_id',
        'user_id'
    ];


    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }
}
