<?php

namespace App\Http\Requests\Payment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'monthly_bill_id' => 'required|exists:monthly_bills,id',
            'amount' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'monthly_bill_id.required' => 'Tagihan wajib dipilih.',
            'monthly_bill_id.exists' => 'Tagihan tidak ditemukan.',

            'amount.required' => 'Jumlah pembayaran wajib diisi.',
            'amount.integer' => 'Jumlah pembayaran harus berupa angka.',
            'amount.min' => 'Jumlah pembayaran minimal 1.',
        ];
    }

    public function attributes(): array
    {
        return [
            'monthly_bill_id' => 'tagihan',
            'amount' => 'jumlah pembayaran',
        ];
    }
}
