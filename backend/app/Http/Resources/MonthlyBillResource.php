<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MonthlyBillResource extends JsonResource
{
    public function toArray($request): array
    {
        $paid = $this->payments->sum('amount');

        return [
            'id' => $this->id,
            'house' => [
                'id' => $this->house->id,
                'house_number' => $this->house->house_number,
            ],
            'resident' => [
                'id' => $this->resident->id,
                'full_name' => $this->resident->full_name,
            ],
            'month' => $this->month,
            'year' => $this->year,
            'security_fee' => $this->security_fee,
            'cleaning_fee' => $this->cleaning_fee,
            'total' => $this->total,
            'paid_amount' => $paid,
            'remaining_amount' => $this->total - $paid,
            'status' => $this->status,

            'payments' => $this->payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'payment_method' => $payment->payment_method,
                    'payments_count' => $this->payments->count(),
                    'paid_at' => $payment->paid_at?->format('Y-m-d H:i'),
                ];
            }),

            'created_at' => $this->created_at,
        ];
    }
}
