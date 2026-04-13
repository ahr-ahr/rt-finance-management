<?php

namespace App\Filters;

class ExpenseFilter extends QueryFilter
{
    public function type($value)
    {
        $this->query->where('type', $value);
    }

    public function date($value)
    {
        $this->query->whereDate('date', $value);
    }

    public function sort_by($value)
    {
        $direction = request('sort_dir', 'desc');
        $this->query->orderBy($value, $direction);
    }
}
