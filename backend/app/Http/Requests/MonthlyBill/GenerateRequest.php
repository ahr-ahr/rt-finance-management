<?php

namespace App\Http\Requests\MonthlyBill;

use Illuminate\Foundation\Http\FormRequest;

class GenerateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'month.required' => 'Bulan wajib diisi.',
            'month.integer' => 'Bulan harus angka.',
            'month.min' => 'Bulan minimal 1.',
            'month.max' => 'Bulan maksimal 12.',

            'year.required' => 'Tahun wajib diisi.',
            'year.integer' => 'Tahun harus angka.',
        ];
    }

    public function attributes(): array
    {
        return [
            'month' => 'bulan',
            'year' => 'tahun',
        ];
    }
}
