<?php

namespace App\Filters;

use Illuminate\Http\Request;

class QueryFilter
{
    protected $request;
    protected $query;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function apply($query)
    {
        $this->query = $query;

        foreach ($this->request->all() as $name => $value) {
            if (method_exists($this, $name) && !is_null($value)) {
                $this->$name($value);
            }
        }

        return $this->query;
    }
}

?>