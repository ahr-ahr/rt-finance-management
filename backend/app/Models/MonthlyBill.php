<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MonthlyBill extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'house_id',
        'resident_id',
        'month',
        'year',
        'security_fee',
        'cleaning_fee',
        'total',
        'status',
    ];

    protected $casts = [
        'month' => 'integer',
        'year' => 'integer',
        'security_fee' => 'integer',
        'cleaning_fee' => 'integer',
        'total' => 'integer',
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function isPaid()
    {
        return $this->status === 'paid';
    }
}

?>