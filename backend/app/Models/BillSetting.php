<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BillSetting extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'security_fee',
        'cleaning_fee',
        'effective_date',
    ];

    protected $casts = [
        'security_fee' => 'integer',
        'cleaning_fee' => 'integer',
        'effective_date' => 'date',
    ];
}

?>