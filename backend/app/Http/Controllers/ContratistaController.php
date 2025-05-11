<?php

namespace App\Http\Controllers;

use App\Models\Contratista;
use App\Models\Proyecto;
use App\Models\Concepto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ContratistaController extends Controller
{
    public function index()
    {
        try {
            $contratistas = Contratista::with(['proyectos', 'especialidad'])->get();
            return response()->json($contratistas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los contratistas: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Depuración: mostrar los datos recibidos
            Log::info('Datos recibidos en store:', $request->all());

            DB::beginTransaction();

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'rfc' => 'required|string|max:13',
                'telefono' => 'required|string|max:20',
                'especialidad_id' => 'nullable|exists:especialidades,id',
            ]);

            // Depuración: mostrar los datos validados
            Log::info('Datos validados:', $validated);

            $contratista = Contratista::create($validated);

            // Procesar proyectos
            if ($request->has('proyectos')) {
                $proyectos = json_decode($request->proyectos, true);
                Log::info('Proyectos recibidos:', ['proyectos' => $proyectos]);
                if (is_array($proyectos) && count($proyectos) > 0) {
                    $contratista->proyectos()->attach($proyectos);
                }
            }

            // Procesar documentos
            if ($request->hasFile('documentos')) {
                Log::info('Documentos recibidos:', ['count' => count($request->file('documentos'))]);
                $this->procesarDocumentos($request, $contratista);
            }

            DB::commit();
            return response()->json($contratista->load('proyectos'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en store:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Error al crear el contratista: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $contratista = Contratista::with(['proyectos', 'especialidad'])->findOrFail($id);

            // Obtener documentos si existen
            $documentos = [];
            $path = 'contratistas/' . $id;
            if (Storage::exists($path)) {
                $files = Storage::files($path);
                foreach ($files as $file) {
                    $documentos[] = [
                        'id' => basename($file),
                        'nombre' => basename($file),
                        'url' => Storage::url($file),
                        'fecha' => Storage::lastModified($file)
                    ];
                }
            }

            $contratista->documentos = $documentos;

            return response()->json($contratista);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Contratista no encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener el contratista: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Depuración: mostrar los datos recibidos
            Log::info('Datos recibidos en update:', $request->all());

            DB::beginTransaction();

            $contratista = Contratista::findOrFail($id);

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'rfc' => 'required|string|max:13',
                'telefono' => 'required|string|max:20',
                'especialidad_id' => 'nullable|exists:especialidades,id',
            ]);

            // Depuración: mostrar los datos validados
            Log::info('Datos validados:', $validated);

            $contratista->update($validated);

            // Actualizar proyectos
            if ($request->has('proyectos')) {
                $proyectos = json_decode($request->proyectos, true);
                Log::info('Proyectos recibidos:', ['proyectos' => $proyectos]);
                $contratista->proyectos()->sync($proyectos);
            }

            // Procesar documentos nuevos
            if ($request->hasFile('documentos')) {
                Log::info('Documentos recibidos:', ['count' => count($request->file('documentos'))]);
                $this->procesarDocumentos($request, $contratista);
            }

            DB::commit();
            return response()->json($contratista->load('proyectos'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en update:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Error al actualizar el contratista: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $contratista = Contratista::findOrFail($id);

            // Eliminar documentos
            $path = 'contratistas/' . $id;
            if (Storage::exists($path)) {
                Storage::deleteDirectory($path);
            }

            // Eliminar relaciones con proyectos
            $contratista->proyectos()->detach();

            $contratista->delete();

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar el contratista: ' . $e->getMessage()], 500);
        }
    }

    public function assignToProject($contratistaId, $proyectoId)
    {
        try {
            $contratista = Contratista::findOrFail($contratistaId);
            $proyecto = Proyecto::findOrFail($proyectoId);

            $contratista->proyectos()->attach($proyectoId);

            return response()->json(['message' => 'Contratista asignado al proyecto correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al asignar el contratista al proyecto: ' . $e->getMessage()], 500);
        }
    }

    public function removeFromProject($contratistaId, $proyectoId)
    {
        try {
            $contratista = Contratista::findOrFail($contratistaId);

            $contratista->proyectos()->detach($proyectoId);

            return response()->json(['message' => 'Contratista removido del proyecto correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al remover el contratista del proyecto: ' . $e->getMessage()], 500);
        }
    }

    public function deleteDocument($contratistaId, $documentId)
    {
        try {
            $path = 'contratistas/' . $contratistaId . '/' . $documentId;

            if (Storage::exists($path)) {
                Storage::delete($path);
                return response()->json(['message' => 'Documento eliminado correctamente']);
            }

            return response()->json(['error' => 'Documento no encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el documento: ' . $e->getMessage()], 500);
        }
    }

    private function procesarDocumentos(Request $request, Contratista $contratista)
    {
        $documentos = $request->file('documentos');

        foreach ($documentos as $documento) {
            $path = $documento->store('contratistas/' . $contratista->id);
        }
    }

    /**
     * Obtener todos los conceptos de un contratista
     */
    public function getConceptos($id)
    {
        try {
            $contratista = Contratista::findOrFail($id);
            $conceptos = $contratista->conceptos()->with(['proyecto', 'pagos'])->get();

            return response()->json([
                'success' => true,
                'data' => $conceptos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los conceptos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener los conceptos de un contratista en un proyecto específico
     */
    public function getConceptosByProyecto($contratistaId, $proyectoId)
    {
        try {
            $contratista = Contratista::findOrFail($contratistaId);
            $proyecto = Proyecto::findOrFail($proyectoId);

            // Verificar que el contratista esté asignado al proyecto
            $contratistaAsignado = $proyecto->contratistas()->where('contratista_id', $contratistaId)->exists();

            if (!$contratistaAsignado) {
                return response()->json([
                    'success' => false,
                    'message' => 'El contratista no está asignado a este proyecto'
                ], 422);
            }

            $conceptos = Concepto::where('contratista_id', $contratistaId)
                ->where('proyecto_id', $proyectoId)
                ->with(['pagos'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $conceptos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los conceptos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear un nuevo concepto para un contratista en un proyecto específico
     */
    public function createConcepto(Request $request, $contratistaId, $proyectoId)
    {
        try {
            $contratista = Contratista::findOrFail($contratistaId);
            $proyecto = Proyecto::findOrFail($proyectoId);

            // Verificar que el contratista esté asignado al proyecto
            $contratistaAsignado = $proyecto->contratistas()->where('contratista_id', $contratistaId)->exists();

            if (!$contratistaAsignado) {
                return response()->json([
                    'success' => false,
                    'message' => 'El contratista no está asignado a este proyecto'
                ], 422);
            }

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'monto_total' => 'required|numeric|min:0',
                'anticipo' => 'nullable|numeric|min:0',
            ]);

            $validated['contratista_id'] = $contratistaId;
            $validated['proyecto_id'] = $proyectoId;

            DB::beginTransaction();

            $concepto = Concepto::create($validated);

            // Si se proporcionó un anticipo, crear un pago de anticipo
            if (isset($validated['anticipo']) && $validated['anticipo'] > 0) {
                try {
                    $concepto->pagos()->create([
                        'monto' => $validated['anticipo'],
                        'fecha' => now(),
                        'descripcion' => 'Anticipo para el concepto: ' . $concepto->nombre,
                        'es_anticipo' => true,
                        'proyecto_id' => $proyectoId
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error al crear pago de anticipo: ' . $e->getMessage());
                    throw $e;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Concepto creado exitosamente',
                'data' => $concepto->load(['pagos'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el concepto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de contratistas
     */
    public function stats()
    {
        try {
            Log::info('Iniciando stats en ContratistaController');

            // Total de contratistas
            $total = Contratista::count();
            Log::info('Total de contratistas encontrados: ' . $total);

            // Calcular total de conceptos (suma de montos totales)
            $totalConceptos = DB::table('conceptos')
                ->whereNotNull('contratista_id')
                ->whereNotNull('monto_total')
                ->sum('monto_total');
            Log::info('Total de conceptos calculado: ' . $totalConceptos);

            // Calcular total pagado (suma de pagos)
            $totalPagado = DB::table('pagos')
                ->join('conceptos', 'pagos.concepto_id', '=', 'conceptos.id')
                ->whereNotNull('conceptos.contratista_id')
                ->whereNotNull('pagos.monto')
                ->sum('pagos.monto');
            Log::info('Total pagado calculado: ' . $totalPagado);

            try {
                // Obtener contratistas por proyecto
                $contratistasPorProyecto = DB::table('contratista_proyecto')
                    ->join('proyectos', 'contratista_proyecto.proyecto_id', '=', 'proyectos.id')
                    ->select('proyectos.nombre', DB::raw('COUNT(contratista_id) as total'))
                    ->groupBy('proyectos.id', 'proyectos.nombre')
                    ->orderBy('total', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::warning('No se pudo obtener contratistas por proyecto: ' . $e->getMessage());
                $contratistasPorProyecto = [];
            }

            try {
                // Obtener conceptos por contratista
                $conceptosPorContratista = DB::table('conceptos')
                    ->join('contratistas', 'conceptos.contratista_id', '=', 'contratistas.id')
                    ->select(
                        'contratistas.nombre',
                        DB::raw('COUNT(conceptos.id) as total_conceptos'),
                        DB::raw('COALESCE(SUM(conceptos.monto_total), 0) as monto_total')
                    )
                    ->groupBy('contratistas.id', 'contratistas.nombre')
                    ->orderBy('monto_total', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::warning('No se pudo obtener conceptos por contratista: ' . $e->getMessage());
                $conceptosPorContratista = [];
            }

            try {
                // Obtener pagos por mes
                $pagosPorMes = DB::table('pagos')
                    ->join('conceptos', 'pagos.concepto_id', '=', 'conceptos.id')
                    ->whereNotNull('conceptos.contratista_id')
                    ->whereNotNull('pagos.monto')
                    ->select(
                        DB::raw("strftime('%m', pagos.fecha) as mes"),
                        DB::raw("strftime('%Y', pagos.fecha) as año"),
                        DB::raw('SUM(pagos.monto) as total')
                    )
                    ->whereDate('pagos.fecha', '>=', now()->subMonths(6))
                    ->groupBy('año', 'mes')
                    ->orderBy('año')
                    ->orderBy('mes')
                    ->get();
            } catch (\Exception $e) {
                Log::warning('No se pudo obtener pagos por mes: ' . $e->getMessage());
                $pagosPorMes = [];
            }

            $response = [
                'total' => $total,
                'totalConceptos' => $totalConceptos,
                'totalPagado' => $totalPagado,
                'contratistasPorProyecto' => $contratistasPorProyecto,
                'conceptosPorContratista' => $conceptosPorContratista,
                'pagosPorMes' => $pagosPorMes
            ];

            Log::info('Respuesta final de stats:', $response);
            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Error en ContratistaController@stats: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            // Intentar obtener al menos el total de contratistas en caso de error
            try {
                $total = Contratista::count();
                return response()->json([
                    'total' => $total,
                    'totalConceptos' => 0,
                    'totalPagado' => 0,
                    'contratistasPorProyecto' => [],
                    'conceptosPorContratista' => [],
                    'pagosPorMes' => [],
                    'error' => 'Error parcial: ' . $e->getMessage()
                ]);
            } catch (\Exception $innerE) {
                Log::error('Error al obtener el total de contratistas: ' . $innerE->getMessage());
                return response()->json([
                    'total' => 0,
                    'totalConceptos' => 0,
                    'totalPagado' => 0,
                    'contratistasPorProyecto' => [],
                    'conceptosPorContratista' => [],
                    'pagosPorMes' => [],
                    'error' => 'Error total: ' . $e->getMessage()
                ]);
            }
        }
    }
}
