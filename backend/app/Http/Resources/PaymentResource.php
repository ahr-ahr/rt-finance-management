<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'monthly_bill_id' => $this->monthly_bill_id,
            'amount' => $this->amount,
            'payment_method' => $this->payment_method,
            'paid_at' => $this->paid_at?->format('Y-m-d H:i'),
            'remaining_amount' => $this->monthlyBill
                ? $this->monthlyBill->total - $this->monthlyBill->payments->sum('amount')
                : null,
            'monthly_bill' => $this->whenLoaded('monthlyBill', function () {
                if (!$this->monthlyBill) {
                    return null;
                }

                return [
                    'id' => $this->monthlyBill->id,
                    'month' => $this->monthlyBill->month,
                    'year' => $this->monthlyBill->year,
                    'total' => $this->monthlyBill->total,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
