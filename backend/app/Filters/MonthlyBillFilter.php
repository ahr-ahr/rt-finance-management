<?php

namespace App\Filters;

class MonthlyBillFilter extends QueryFilter
{
    public function status($value)
    {
        $this->query->where('status', $value);
    }

    public function month($value)
    {
        $this->query->where('month', $value);
    }

    public function year($value)
    {
        $this->query->where('year', $value);
    }

    public function house_id($value)
    {
        $this->query->where('house_id', $value);
    }

    public function resident_id($value)
    {
        $this->query->where('resident_id', $value);
    }

    public function sort_by($value)
    {
        $direction = request('sort_dir', 'desc');
        $this->query->orderBy($value, $direction);
    }
}
