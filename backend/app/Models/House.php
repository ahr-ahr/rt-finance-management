<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_number',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function currentResident()
    {
        return $this->hasOne(HouseResident::class)->whereNull('end_date');
    }

    public function monthlyBills()
    {
        return $this->hasMany(MonthlyBill::class);
    }

    public function isOccupied()
    {
        return $this->status === 'occupied';
    }
}

?>