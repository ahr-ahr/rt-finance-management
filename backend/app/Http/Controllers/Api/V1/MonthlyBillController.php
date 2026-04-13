<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\MonthlyBill;
use App\Filters\MonthlyBillFilter;
use App\Http\Controllers\ApiController;
use App\Http\Resources\MonthlyBillResource;
use App\Http\Requests\MonthlyBill\GenerateRequest;
use App\Actions\GenerateMonthlyBillsAction;

class MonthlyBillController extends ApiController
{
    public function index(MonthlyBillFilter $filter)
    {
        $query = $filter->apply(
            MonthlyBill::with('payments')
        );

        $bills = $query->latest()->paginate(request('per_page', 10));

        return $this->success(
            MonthlyBillResource::collection($bills),
            'List monthly bills',
            200,
            [
                'current_page' => $bills->currentPage(),
                'last_page' => $bills->lastPage(),
                'per_page' => $bills->perPage(),
                'total' => $bills->total(),
            ]
        );
    }

    public function show($id)
    {
        $bill = MonthlyBill::with([
            'payments',
            'resident',
            'house'
        ])->findOrFail($id);

        return $this->success(
            new MonthlyBillResource($bill),
            'Monthly bill detail'
        );
    }

    public function generate(
        GenerateRequest $request,
        GenerateMonthlyBillsAction $action
    ) {
        $count = $action->execute(
            $request->month,
            $request->year
        );

        return $this->success(
            [
                'generated_count' => $count
            ],
            'Monthly bills generated successfully'
        );
    }
}
