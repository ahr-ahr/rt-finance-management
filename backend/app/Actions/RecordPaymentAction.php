<?php

namespace App\Actions;

use App\Models\MonthlyBill;
use App\Models\Payment;

class RecordPaymentAction
{
    public function execute(int $billId, int $amount): array
    {
        $bill = MonthlyBill::findOrFail($billId);

        if ($bill->isPaid()) {
            return [
                'status' => 'already_paid',
                'bill' => $bill
            ];
        }

        $totalPaid = $bill->payments()->sum('amount');
        $remaining = $bill->total - $totalPaid;

        if ($amount > $remaining) {
            return [
                'status' => 'overpay',
                'remaining' => $remaining,
                'bill' => $bill
            ];
        }

        Payment::create([
            'monthly_bill_id' => $bill->id,
            'amount' => $amount,
            'paid_at' => now(),
        ]);

        $totalPaid += $amount;

        if ($totalPaid >= $bill->total) {
            $bill->update([
                'status' => 'paid'
            ]);
        }

        return [
            'status' => 'paid_recorded',
            'bill' => $bill->fresh()
        ];
    }
}
