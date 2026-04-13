<?php

namespace App\Actions;

use App\Models\House;
use App\Models\MonthlyBill;
use App\Models\BillSetting;

class GenerateMonthlyBillsAction
{
    public function execute(int $month, int $year): int
    {
        $targetDate = now()->setMonth($month)->setYear($year);

        $setting = BillSetting::where('effective_date', '<=', $targetDate)
            ->latest('effective_date')
            ->first();

        if (!$setting) {
            return 0;
        }

        $count = 0;

        $houses = House::where('status', 'occupied')->get();

        foreach ($houses as $house) {
            $activeResident = $house->houseResidents()
                ->whereNull('end_date')
                ->first();

            if (!$activeResident) {
                continue;
            }

            $bill = MonthlyBill::firstOrCreate(
                [
                    'house_id' => $house->id,
                    'resident_id' => $activeResident->resident_id,
                    'month' => $month,
                    'year' => $year,
                ],
                [
                    'security_fee' => $setting->security_fee,
                    'cleaning_fee' => $setting->cleaning_fee,
                    'total' => $setting->security_fee + $setting->cleaning_fee,
                    'status' => 'unpaid',
                ]
            );

            if ($bill->wasRecentlyCreated) {
                $count++;
            }
        }

        return $count;
    }
}
