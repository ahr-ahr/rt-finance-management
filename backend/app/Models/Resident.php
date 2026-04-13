<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'ktp_photo',
        'phone',
        'is_married',
        'type',
    ];

    protected $casts = [
        'is_married' => 'boolean',
    ];

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function monthlyBills()
    {
        return $this->hasMany(MonthlyBill::class);
    }

    public function isContract()
    {
        return $this->type === 'kontrak';
    }
}


?>
