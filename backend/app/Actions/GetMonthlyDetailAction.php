<?php

namespace App\Actions;

use App\Models\Payment;
use App\Models\Expense;

class GetMonthlyDetailAction
{
    public function execute(int $month, int $year): array
    {
        $income = Payment::with('monthlyBill')
            ->whereYear('paid_at', $year)
            ->whereMonth('paid_at', $month)
            ->get();

        $expense = Expense::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();

        return [
            'income' => $income,
            'expense' => $expense,
            'total_income' => (int) $income->sum('amount'),
            'total_expense' => (int) $expense->sum('amount'),
            'balance' => (int) ($income->sum('amount') - $expense->sum('amount')),
        ];
    }
}
