<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    ResidentController,
    HouseController,
    MonthlyBillController,
    PaymentController,
    ReportController,
    ExpenseController,
    BillSettingController
};

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('residents', ResidentController::class);
    Route::get('residents/{resident}/ktp', [ResidentController::class, 'ktp']);
    Route::apiResource('houses', HouseController::class);

    Route::post('houses/{house}/assign-resident', [HouseController::class, 'assignResident']);
    Route::post('houses/{house}/vacate', [HouseController::class, 'vacate']);

    Route::get('monthly-bills', [MonthlyBillController::class, 'index']);
    Route::get('monthly-bills/{id}', [MonthlyBillController::class, 'show']);
    Route::post('monthly-bills/generate', [MonthlyBillController::class, 'generate']);

    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('payments', [PaymentController::class, 'index']);

    Route::prefix('reports')->group(function () {
        Route::get('summary', [ReportController::class, 'summary']);
        Route::get('monthly', [ReportController::class, 'monthly']);
    });

    Route::apiResource('expenses', ExpenseController::class);

    Route::get('bill-settings', [BillSettingController::class, 'index']);
    Route::post('bill-settings', [BillSettingController::class, 'store']);

});
