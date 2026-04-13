<?php

namespace App\Http\Requests\House;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AssignResidentRequest extends FormRequest
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
            'resident_id' => 'required|exists:residents,id',
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Penghuni wajib dipilih.',
            'resident_id.exists' => 'Penghuni tidak ditemukan.',
        ];
    }

    public function attributes(): array
    {
        return [
            'resident_id' => 'penghuni',
        ];
    }
}
