<?php

namespace App\Actions;

use App\Models\{House, HouseResident};

class AssignResidentToHouseAction
{
    public function execute(House $house, int $residentId): bool
    {
        $current = $house->houseResidents()
            ->whereNull('end_date')
            ->first();

        if ($current && $current->resident_id == $residentId) {
            return false;
        }

        $existing = HouseResident::where('resident_id', $residentId)
            ->whereNull('end_date')
            ->first();

        if ($existing && $existing->house_id !== $house->id) {
            $existing->update([
                'end_date' => now()
            ]);
        }

        $house->houseResidents()
            ->whereNull('end_date')
            ->update([
                'end_date' => now()
            ]);

        $house->houseResidents()->create([
            'resident_id' => $residentId,
            'start_date' => now(),
        ]);

        $house->update([
            'status' => 'occupied'
        ]);

        return true;
    }
}

?>
