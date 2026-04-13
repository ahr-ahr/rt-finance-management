<?php

namespace App\Actions;

use App\Models\House;

class VacateResidentToHouseAction
{
    public function execute(House $house): bool
    {
        $current = $house->houseResidents()
            ->whereNull('end_date')
            ->first();

        if (!$current) {
            return false;
        }

        $current->update([
            'end_date' => now()
        ]);

        $house->update([
            'status' => 'vacant'
        ]);

        return true;
    }
}
