<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Expense;
use App\Filters\ExpenseFilter;
use App\Http\Controllers\ApiController;
use App\Http\Requests\Expense\StoreRequest;
use App\Http\Requests\Expense\UpdateRequest;
use App\Http\Resources\ExpenseResource;

class ExpenseController extends ApiController
{
    public function index(ExpenseFilter $filter)
    {
        $query = $filter->apply(Expense::query());

        $expenses = $query->latest()->paginate(request('per_page', 10));

        return $this->success(
            ExpenseResource::collection($expenses),
            'List expenses',
            200,
            [
                'current_page' => $expenses->currentPage(),
                'last_page' => $expenses->lastPage(),
                'per_page' => $expenses->perPage(),
                'total' => $expenses->total(),
            ]
        );
    }

    public function store(StoreRequest $request)
    {
        $expense = Expense::create($request->validated());

        return $this->created(
            new ExpenseResource($expense),
            'Expense created'
        );
    }

    public function show($id)
    {
        $expense = Expense::findOrFail($id);

        return $this->success(
            new ExpenseResource($expense),
            'Expense detail'
        );
    }

    public function update(UpdateRequest $request, $id)
    {
        $expense = Expense::findOrFail($id);

        $expense->update($request->validated());

        return $this->success(
            new ExpenseResource($expense),
            'Expense updated'
        );
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);

        $expense->delete();

        return $this->success(null, 'Expense deleted');
    }
}
