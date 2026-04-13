<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Payment\StoreRequest;
use App\Actions\RecordPaymentAction;
use App\Http\Resources\{
    MonthlyBillResource,
    PaymentResource
};
use App\Filters\PaymentFilter;
use App\Models\Payment;

class PaymentController extends ApiController
{
    public function index(PaymentFilter $filter)
    {
        $query = $filter->apply(
            Payment::with('monthlyBill')
        );

        $payments = $query->latest()->paginate(request('per_page', 10));

        return $this->success(
            PaymentResource::collection($payments),
            'List payments',
            200,
            [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ]
        );
    }

    public function store(
        StoreRequest $request,
        RecordPaymentAction $action
    ) {
        $result = $action->execute(
            $request->monthly_bill_id,
            $request->amount
        );

        if ($result['status'] === 'already_paid') {
            return $this->success(
                new MonthlyBillResource($result['bill']),
                'Bill already paid'
            );
        }

        if ($result['status'] === 'overpay') {
            return response()->json([
                'success' => false,
                'message' => 'Payment exceeds remaining amount',
                'data' => [
                    'remaining' => $result['remaining']
                ]
            ], 422);
        }

        return $this->success(
            new MonthlyBillResource($result['bill']),
            'Payment recorded successfully'
        );
    }
}
