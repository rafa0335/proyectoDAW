<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Curso;
use App\Models\MatriculacionE;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class MatriculacionController extends Controller
{
    //MATRICULAR ALUMNO
    public function matricularAlumno(Request $request){

        $curso_id = $request->json('curso_id');
        $user_id = Auth::id();
        // Obtiene el curso
        $curso = Curso::find($curso_id);
        // Verifica si el curso existe
        if (!$curso) {
            return response()->json(['message' => 'El curso no existe'], 404);
        }
        $matriculacionP = MatriculacionE::where("curso_id", $curso->id)->where("user_id", $user_id)->get();
        if(count($matriculacionP) > 0)
        {
            return response()->json([
                'mensaje' => 'Usuario ya está matriculado.'
            ], 404);
        }
        // Verifica si hay plazas disponibles en el curso
        if ($curso->plazas <= 0) {
            return response()->json(['message' => 'No hay plazas disponibles en este curso'], 400);
        }
        $matriculacion = MatriculacionE::create([
            'curso_id' => $curso_id,
            'user_id' =>  $user_id,
        ]);
        // Actualiza la cantidad de plazas disponibles en el curso
        $curso->plazas--;
        $curso->save();
        return response()->json(['message' => 'Alumno matriculado con éxito']);
    }

    //DESMATRICULAR ALUMNOS
    /*public function borrarMatriculacion($id)
    {
        // Obtén el ID del curso y el ID del usuario autenticado
        $curso_id = $id;
        $user_id = Auth::id();

        // Obtiene el curso
        $curso = Curso::find($curso_id);

        // Verifica si el curso existe
        if (!$curso) {
            return response()->json(['message' => 'El curso no existe'], 404);
        }

        // Busca la matriculación del usuario en el curso
        $matriculacionP = MatriculacionE::where("curso_id", $curso->id)->where("user_id", $user_id)->first();

        // Verifica si el usuario está matriculado
        if (!$matriculacionP) {
            return response()->json([
                'mensaje' => 'Usuario no matriculado en este curso'
            ], 404);
        }
        // Elimina la matriculación
        $matriculacionP->delete();
        $curso->plazas++;
        $curso->save();
        // Devuelve la respuesta
        return response()->json(['message' => 'Alumno desmatriculado con éxito']);
    }*/

    public function borrarMatriculacion($id)
    {
        // Obtén el ID del curso y el ID del usuario autenticado
        $curso_id = $id;
        $user_id = Auth::id();

        // Obtiene la matriculación
        $matriculacion = MatriculacionE::where('curso_id', $curso_id)->where('user_id', $user_id);



        // Verifica si la matriculación existe
        if (!$matriculacion) {
            return response()->json(['message' => 'La matriculación no existe'], 404);
        }

        // Elimina la matriculación
        $matriculacion->delete();

        // Actualiza el número de plazas en el curso
        $curso = Curso::find($curso_id);
        if ($curso) {
            $curso->plazas++;
            $curso->save();
        } else {
            return response()->json(['message' => 'El curso no existe'], 404);
        }

        // Devuelve la respuesta
        return response()->json(['message' => 'Matriculación eliminada con éxito']);
    }

}

