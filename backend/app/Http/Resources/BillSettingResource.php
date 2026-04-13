<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BillSettingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'security_fee' => $this->security_fee,
            'cleaning_fee' => $this->cleaning_fee,
            'effective_date' => $this->effective_date?->format('Y-m-d'),
        ];
    }
}
