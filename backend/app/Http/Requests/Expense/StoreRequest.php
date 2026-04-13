<?php

namespace App\Http\Requests\Expense;

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
            'title' => 'required|string|max:255',
            'amount' => 'required|integer|min:1',
            'type' => 'required|in:monthly,incident',
            'date' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul pengeluaran wajib diisi.',
            'amount.required' => 'Jumlah wajib diisi.',
            'amount.min' => 'Jumlah minimal 1.',
            'type.in' => 'Tipe harus monthly atau incident.',
            'date.required' => 'Tanggal wajib diisi.',
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'judul',
            'amount' => 'jumlah',
            'type' => 'tipe',
            'date' => 'tanggal',
        ];
    }
}
