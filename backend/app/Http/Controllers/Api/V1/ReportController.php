<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\ApiController;
use App\Actions\GetMonthlySummaryAction;
use App\Actions\GetMonthlyDetailAction;

class ReportController extends ApiController
{
    public function summary(GetMonthlySummaryAction $action)
    {
        $year = request('year', now()->year);

        $data = $action->execute($year);

        return $this->success($data, 'Summary report');
    }

    public function monthly(GetMonthlyDetailAction $action)
    {
        $month = request('month', now()->month);
        $year = request('year', now()->year);

        $data = $action->execute($month, $year);

        return $this->success($data, 'Monthly detail report');
    }
}
