<?php

namespace App\Filters;

class PaymentFilter extends QueryFilter
{
    public function monthly_bill_id($value)
    {
        $this->query->where('monthly_bill_id', $value);
    }

    public function payment_method($value)
    {
        $this->query->where('payment_method', $value);
    }

    public function date($value)
    {
        $this->query->whereDate('paid_at', $value);
    }

    public function sort_by($value)
    {
        $direction = request('sort_dir', 'desc');
        $this->query->orderBy($value, $direction);
    }
}
