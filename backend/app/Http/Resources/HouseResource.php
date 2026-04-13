<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HouseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'house_number' => $this->house_number,
            'status' => $this->status,
            'current_resident' => $this->whenLoaded(
                'currentResident',
                function () {
                    return [
                        'id' => $this->currentResident->resident->id,
                        'full_name' => $this->currentResident->resident->full_name,
                    ];
                }
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
