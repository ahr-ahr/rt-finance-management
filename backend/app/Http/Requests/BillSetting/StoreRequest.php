<?php

namespace App\Http\Requests\BillSetting;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'security_fee' => 'required|integer|min:0',
            'cleaning_fee' => 'required|integer|min:0',
            'effective_date' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'security_fee.required' => 'Biaya satpam wajib diisi.',
            'cleaning_fee.required' => 'Biaya kebersihan wajib diisi.',
            'effective_date.required' => 'Tanggal berlaku wajib diisi.',
        ];
    }

    public function attributes(): array
    {
        return [
            'security_fee' => 'biaya satpam',
            'cleaning_fee' => 'biaya kebersihan',
            'effective_date' => 'tanggal berlaku',
        ];
    }
}
