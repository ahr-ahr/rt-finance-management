<?php

namespace App\Filters;

class ResidentFilter extends QueryFilter
{
    public function search($value)
    {
        $this->query->where('full_name', 'like', "%{$value}%");
    }

    public function type($value)
    {
        $this->query->where('type', $value);
    }

    public function is_married($value)
    {
        $this->query->where('is_married', $value);
    }

    public function sort_by($value)
    {
        $direction = request('sort_dir', 'desc');
        $this->query->orderBy($value, $direction);
    }
}

?>
