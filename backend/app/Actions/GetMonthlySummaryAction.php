<?php

namespace App\Actions;

use App\Models\Payment;
use App\Models\Expense;

class GetMonthlySummaryAction
{
    public function execute(int $year): array
    {
        $data = [];

        for ($month = 1; $month <= 12; $month++) {
            $income = (int) Payment::whereYear('paid_at', $year)
                ->whereMonth('paid_at', $month)
                ->sum('amount');

            $expense = (int) Expense::whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('amount');

            $data[] = [
                'month' => $month,
                'income' => $income,
                'expense' => $expense,
                'balance' => $income - $expense,
            ];
        }

        return $data;
    }
}
