<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|string|in:draft,scheduled,published',
            'scheduled_time' => ['date_format:Y-m-d H:i:s', "required_if:status,scheduled"],
            'platform_ids' => 'required|array',
            'platform_ids.*' => 'integer|exists:platforms,id',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'scheduled_time.required_if' => 'The scheduled time is required',
            'status.in' => 'The selected status is invalid.',
            'platform_ids.*' => 'The selected platform is invalid.',
        ];
    }
}
