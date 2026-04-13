<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
    protected function success(
        $data = null,
        string $message = 'Success',
        int $code = 200,
        array $meta = []
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => (object) $meta,
        ], $code);
    }

    protected function created(
        $data = null,
        string $message = 'Created',
        array $meta = []
    ): JsonResponse {
        return $this->success($data, $message, 201, $meta);
    }

    protected function error(
        string $message = 'Error',
        int $code = 400,
        $data = null
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function notFound(string $message = 'Data not found'): JsonResponse
    {
        return $this->error($message, 404);
    }
}
