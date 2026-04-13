<?php

namespace App\Http\Requests\Resident;

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
            'full_name' => 'sometimes|required|string|max:50',
            'phone' => 'sometimes|required|string|max:20',
            'is_married' => 'sometimes|required|boolean',
            'type' => 'sometimes|required|in:tetap,kontrak',
            'ktp_photo' => 'nullable|image|max:4096'
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.string' => 'Nama lengkap harus berupa teks.',
            'full_name.max' => 'Nama lengkap maksimal 50 karakter.',

            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.string' => 'Nomor telepon harus berupa teks.',
            'phone.max' => 'Nomor telepon maksimal 20 karakter.',

            'is_married.required' => 'Status pernikahan wajib diisi.',
            'is_married.boolean' => 'Status pernikahan harus berupa true atau false.',

            'type.required' => 'Tipe penghuni wajib diisi.',
            'type.in' => 'Tipe penghuni harus tetap atau kontrak.',

            'ktp_photo.image' => 'Foto KTP harus berupa gambar.',
            'ktp_photo.max' => 'Ukuran foto KTP maksimal 4MB.',
            'ktp_photo.mimes' => 'Format foto KTP harus jpg, jpeg, atau png.',
        ];
    }

    public function attributes(): array
    {
        return [
            'full_name' => 'nama lengkap',
            'phone' => 'nomor telepon',
            'is_married' => 'status pernikahan',
            'type' => 'tipe penghuni',
            'ktp_photo' => 'foto KTP',
        ];
    }
}
