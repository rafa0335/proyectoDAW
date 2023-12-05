<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use App\Models\Curso;
use App\Models\MatriculacionE;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;



class AuthController extends Controller{
    // Función que utilizaremos para registrar al usuario
    public function index(){
        //  Listamos todos los cursos
        //$usus = User::all();
        $usus = User::where('rol', 'cliente')->get();
        // Respuesta en caso de que todo vaya bien.
        return response()->json([
            'data' => $usus
        ], Response::HTTP_OK);
    }

    public function register(Request $request)
    {
        // Indicamos que solo queremos recibir name, email y password de la request
        // Realizamos las validaciones
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required|string',
            'apellidos' => 'required|string',
            'email' => 'required|email|unique:users',
            'telefono' =>'nullable|string|min:9',
            'password' => 'required|string|min:6|max:50',
            'dni' => ['required', 'string', 'size:9', 'regex:/^\d{8}[A-Za-z]$/i', function ($attribute, $value, $fail) {
                $dniNumber = substr($value, 0, 8);
                $dniLetter = strtoupper(substr($value, 8, 1));

                $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
                $expectedLetter = $letters[$dniNumber % 23];

                if ($dniLetter !== $expectedLetter) {
                    $fail("El DNI no es válido.");
                }
            }, 'unique:users,dni'],

        ]);
        // Devolvemos un error si fallan las validaciones
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }
        try {
            // Creamos el nuevo usuario si todo es correcto
            $user = User::create([
                'name' => $request->json('name'),
                'apellidos' => $request->json('apellidos'),
                'email' => $request->json('email'),
                'telefono'=>$request->json('telefono'),
                'password' => bcrypt($request->json('password')),
                'dni' => $request->json('dni'),
                //Se le asigna el rol de cliente manualmente
                'rol'=>'cliente',
            ]);
            // Devolvemos la respuesta con los datos del usuario
            return response()->json([
                'exito' => true,
                'mensaje' => 'Usuario creado',
                'usuario' => $user
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Devolvemos una respuesta JSON en caso de error
            return response()->json([
                'error' => 'Error al registrar el usuario',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }
    // Funcion que utilizaremos para hacer login
    public function login(Request $request)
    {
       // Indicamos que solo queremos recibir email y password de la request
       $credentials = $request->json()->all();
       // Validaciones
       $validator = Validator::make($credentials, [
           'email' => 'required|email',
           'password' => 'required|string'
       ]);
       // Devolvemos un error de validación en caso de fallo en las verificaciones
       if ($validator->fails())
       {
           return response()->json(['error' => $validator->messages()], 400);
       }
       // Intentamos hacer login
       try
       {
           if (!$token = JWTAuth::attempt($credentials)) {
               // Credenciales incorrectas.
               return response()->json([
                   'exito' => false,
                   'mensaje' => 'Login falló: credenciales incorrectas',
               ], 401);
           }
       }
       catch (JWTException $e)
       {
           // Error al intentar crear el token
           return response()->json([
               'exito' => false,
               'mensaje' => 'No se ha podido crear el token',
           ], 500);
       }
       $datosToken = [
           'usuarioId' => Auth::user()->id,
           'dni' =>Auth::user()->dni,
           'nombre' => Auth::user()->name,
           'apellidos'=>Auth::user()->apellidos,
           'email' => Auth::user()->email,
           'rol' => Auth::user()->rol,
           'telefono'=>Auth::user()->telefono,
        ];
        // Genera el token con los datos en el cuerpo
        $tokenConDatos = JWTAuth::claims($datosToken)->attempt($credentials);
       // Devolvemos el token
       return response()->json([
           'exito' => true,
           'token' => $tokenConDatos
       ]);
    }
    public function logout(Request $request){
        try
        {
            // Si el token es válido eliminamos el token desconectando al usuario.
            auth()->logout();
            // Supongamos que tu token está almacenado con la clave "miToken"
            return response()->json([
                'exito' => true,
                    'mensaje' => 'Usuario desconectado'
                ]);
        }
        catch (JWTException $exception)
        {
            // Error al intentar invalidar el token
            return response()->json([
                    'exito' => false,
                    'mensaje' => 'Error al intentar desconectar al usuario'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function editarUsuario(Request $request)
    {

        // Obtiene el ID del usuario autenticado a través del token
        $usuarioAutenticado = Auth::id();
        $user = User::find($usuarioAutenticado);
        // Verifica si el usuario autenticado es el mismo que se va a editar
        if (!$usuarioAutenticado) {
            return response()->json(['message' => 'No tienes permisos para editar este usuario.'], 403);
        }



        // Validar los datos del formulario (ajusta esto según tus necesidades)
        $validator = Validator::make($request->json()->all(), [
            'name' => 'nullable|string',
            'apellidos' => 'nullable|string',
            'email' => [
                'nullable',
                'email',
                Rule::unique('users', 'email')->ignore($usuarioAutenticado),
            ],
            'telefono' => 'nullable|string|min:9',
            'password' => 'nullable|string|min:6|max:50',
            'dni' => [
                'nullable',
                'string',
                'size:9',
                'regex:/^\d{8}[A-Za-z]$/i',
                function ($attribute, $value, $fail) {
                    $dniNumber = substr($value, 0, 8);
                    $dniLetter = strtoupper(substr($value, 8, 1));

                    $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
                    $expectedLetter = $letters[$dniNumber % 23];

                    if ($dniLetter !== $expectedLetter) {
                        $fail("El DNI no es válido.");
                    }
                },
                Rule::unique('users', 'dni')->ignore($usuarioAutenticado),
            ],
        ]);

            if( $validator->fails() ){
                return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 400);
            }

        try {
            // Busca el usuario existente por ID
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            // Actualiza los datos del usuario

            if ($request->json('dni')) {
                $user->dni = $request->json('dni');
            }

            if ($request->json('name')) {
                $user->name = $request->json('name');
            }
            if ($request->json('email')) {
                $user->email = $request->json('email');
            }
            if ($request->json('telefono')) {
                $user->telefono = $request->json('telefono');
            }
            // Actualiza la contraseña si se proporciona una nueva contraseña
            if ($request->json('password')) {
                $user->password = $request->json('password');
            }
            $user->save();
            // Devuelve una respuesta JSON con el usuario modificado
            return response()->json(['message' => 'Usuario modificado con éxito', 'usuario' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al modificar el usuario', 'error' => $e->getMessage()], 500);
        }
    }
    public function cursosMatriculados()
    {
        // Obtener el usuario autenticado
        $usuarioAutenticado = Auth::user();
        $cursosMatriculados = $usuarioAutenticado->cursosMatriculados;
        return response()->json(['cursos' => $cursosMatriculados], 200);
    }
    // Función que utilizaremos para obtener los datos del usuario.
    public function datosUsuario(){
        $usuarioAutenticado = Auth::user();
        if(!$usuarioAutenticado){
            return response()->json([
                'exito' => false,
                'mensaje' => 'Token invalido / token expirado',
            ], 401);
        }
        return response()->json([
            'exito' => true,
            'usuario' => $usuarioAutenticado
        ]);
    }
    // borrar un usuario
    public function borrarUsu($id){
        $UsuarioAutenticado = Auth::user();
        $rol =$UsuarioAutenticado->rol;
        if(($rol=='admin') || $id == $UsuarioAutenticado->id){
            $usu = User::find($id);
            // Verifica si el curso existe
            if (!$usu) {
                return response()->json(['message' => 'El curso no existe'], 404);
            }
            // Consulta matriculaciones para el curso
            $matriculaciones = MatriculacionE::where("user_id", $usu->id)->get();
            // Verifica si hay matriculaciones
            if ($matriculaciones->count() > 0) {
                return response()->json([
                    'mensaje' => ' no se puede borrar ya que tiene esta matriculado en algun curso'
                ], 200);
            } else {
                $usu->delete();
                return response()->json([
                    'data'=> true,
                    'mensaje' => 'Usuario borrado correctamente',
                ], Response::HTTP_OK);
            }
        }else{
            return response()->json([
                'mensaje' => ' no tienes permisos para borrar este usuario'
            ], 200);
        }
    }
}
