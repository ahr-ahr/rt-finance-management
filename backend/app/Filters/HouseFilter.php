<?php

namespace App\Filters;

class HouseFilter extends QueryFilter
{
    public function search($value)
    {
        $this->query->where('house_number', 'like', "%{$value}%");
    }

    public function status($value)
    {
        $this->query->where('status', $value);
    }

    public function sort_by($value)
    {
        $direction = request('sort_dir', 'desc');
        $this->query->orderBy($value, $direction);
    }
}

?>
