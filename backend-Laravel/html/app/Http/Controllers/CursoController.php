<?php



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\Curso;
use App\Models\MatriculacionE;
use Illuminate\Validation\Rule;



class CursoController extends Controller{

     public function index(){
        //  Listamos todos los cursos
        $cursos = Curso::all();

        // Respuesta en caso de que todo vaya bien.
        return response()->json([
            'data' => $cursos
        ], Response::HTTP_OK);
    }
    public function cursoPorId($id){
        $curso = Curso::find($id);

        // Respuesta en caso de que todo vaya bien.
        return response()->json([
            'data' => $curso
        ], Response::HTTP_OK);
    }
    public function agregarCursoConFltro(Request $request)
    {
        // Validar los datos del formulario
        $validator = Validator::make($request->json()->all(), [
            'nombreCurso' => 'required|unique:cursos',
            'precio' => 'required|numeric',
            'plazas' => 'required|integer',
            'descripcion' => 'nullable|string',
            'contenido' => 'nullable|string'
        ]);
        if ($validator->fails()) {
            // Si la validación falla, devuelve una respuesta JSON con los errores
            return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 400);
        }

        // Verificar si ya existe un curso con el mismo nombre
        $cursoExistente = Curso::where('nombreCurso', $request->json('nombreCurso'))->first();

        if ($cursoExistente) {
            // Si ya existe un curso con el mismo nombre, reportar un error en JSON
            return response()->json(['message' => 'Ya existe un curso con este nombre'], 400);
        }
        try {
            // Crear un nuevo curso si los datos son válidos y no hay duplicados
            $curso = Curso::create([
                'nombreCurso' => strtoupper($request->json('nombreCurso')),
                'precio' => $request->json('precio'),
                'plazas' => $request->json('plazas'),
                'descripcion' => $request->json('descripcion'),
                'contenido' => $request->json('contenido')
            ]);


            // Devolver una respuesta JSON con el curso creado
            return response()->json(['message' => 'Curso creado con exito', 'curso' => $curso], 201);
        } catch (\Exception $e) {
            // Devolver una respuesta JSON en caso de error
            return response()->json(['message' => 'Error al crear el curso', 'error' => $e->getMessage()], 500);
        }
    }

    public function borrarCurso($Id) {
        // Obtiene el curso
        $curso = Curso::find($Id);
        // Verifica si el curso existe
        if (!$curso) {
            return response()->json(['message' => 'El curso no existe'], 404);
        }
        // Consulta matriculaciones para el curso
        $matriculaciones = MatriculacionE::where("curso_id", $curso->id)->get();
        // Verifica si hay matriculaciones
        if ($matriculaciones->count() > 0) {
            return response()->json([
                'exito'=> true,
                'mensaje' => 'Curso no se puede desactivar ya que tiene matriculaciones.'
            ], 200);
        } else {
            // No hay matriculaciones, puedes eliminar el curso
            $curso->delete();
            $listaActualizada = Curso::all() ;
            // Devuelve la respuesta
            return response()->json([
                'mensaje' => 'Curso borrado correctamente',
                'data'=> $listaActualizada
            ], Response::HTTP_OK);
        }
    }
    public function updateCurso(Request $request){

        $curso = Curso::find($request->json('id'));
          // Validar los datos del formulario
          $validator = Validator::make($request->json()->all(), [
              'id' => 'required|integer',
              'nombreCurso' => 'required|string',
              Rule::unique('users', 'email')->ignore($curso->id),
              'precio' => 'nullable|numeric',
              'plazas' => 'nullable|integer',
              'descripcion' => 'nullable|string',
              'contenido' => 'nullable|string'
        ]);
        if ($validator->fails()) {
            // Si la validación falla, devuelve una respuesta JSON con los errores
            return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 400);

        }
        try {
            // Buscar el curso existente por ID

            if (!$curso) {
                return response()->json(['message' => 'Curso no encontrado'], 404);
            }
            // Consultar matriculaciones para el curso
            $matriculaciones = MatriculacionE::where("curso_id", $curso->id)->get();
            // Verificar si hay matriculaciones
            if ($matriculaciones->count() > 0) {
                return response()->json([
                    'message' => 'No se puede editar el curso ya que tiene matriculaciones.'
                ], 400);
            }
            // Actualizar los datos del curso
            $curso->nombreCurso = strtoupper($request->json('nombreCurso'));
            $curso->precio = $request->json('precio');
            $curso->plazas = $request->json('plazas');
            $curso->descripcion = $request->json('descripcion');
            $curso->contenido = $request->json('contenido');
            $curso->save();
            // Devolver una respuesta JSON con el curso modificado
            return response()->json(['message' => 'Curso modificado con éxito', 'curso' => $curso], 200);
        }catch (\Exception $e) {
            return response()->json(['message' => 'Error al modificar el curso', 'error' => $e->getMessage()], 500);
        }
     }
     public function usuariosEnCurso($cursoId)
     {
         // Obtener el curso por su ID
         $curso = Curso::find($cursoId);
         if (!$curso) {
             return response()->json(['message' => 'Curso no encontrado'], 404);
        }
         // Obtener la lista de usuarios matriculados en el curso
         $usuariosMatriculados = $curso->usuariosMatriculados;
        // Puedes devolver la lista de usuarios matriculados en este curso como una respuesta JSON
        return response()->json(['usuarios' => $usuariosMatriculados], 200);
     }
}
