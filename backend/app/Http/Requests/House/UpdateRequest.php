<?php

namespace App\Http\Requests\House;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
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
            'house_number' => 'sometimes|required|string|max:50|unique:houses,house_number,' . $this->route('house'),
            'status' => 'sometimes|required|in:occupied,vacant',
        ];
    }

    public function messages(): array
    {
        return [
            'house_number.required' => 'Nomor rumah wajib diisi.',
            'house_number.string' => 'Nomor rumah harus berupa teks.',
            'house_number.max' => 'Nomor rumah maksimal 50 karakter.',
            'house_number.unique' => 'Nomor rumah sudah digunakan.',

            'status.required' => 'Status rumah wajib diisi.',
            'status.in' => 'Status rumah harus occupied atau vacant.',
        ];
    }

    public function attributes(): array
    {
        return [
            'house_number' => 'nomor rumah',
            'status' => 'status rumah',
        ];
    }
}
