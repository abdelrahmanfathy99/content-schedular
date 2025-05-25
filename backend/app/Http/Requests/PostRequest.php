<?php

namespace App\Http\Requests;

use App\Constants\PlatFormConstants;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PostRequest extends FormRequest
{

    protected array $platformMaxLengths = [
        PlatFormConstants::FACEBOOK->value => 63206,
        PlatFormConstants::INSTAGRAM->value => 2200,
        PlatFormConstants::TWITTER->value => 280,
        PlatFormConstants::LINKEDIN->value => 3000
    ];

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

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $content = $this->input('content', '');
            $platformIds = $this->input('platform_ids', []);
            $status = $this->input('status');
            $scheduledTime = $this->input('scheduled_time');

            foreach ($platformIds as $platformId) {
                $maxLength = $this->platformMaxLengths[$platformId] ?? null;
                $platformEnum = PlatFormConstants::tryFrom($platformId);
                if ($maxLength !== null && strlen($content) > $maxLength) {
                    $validator->errors()->add(
                        'content',
                        "Content exceeds the maximum allowed length of {$maxLength} characters for {$platformEnum->label()} platform"
                    );
                }
            }

            // Validate scheduled_time is not in the past
            $post = $this->route('post');
            if ($status === 'scheduled' && $scheduledTime) {
                $isUpdate = $post !== null;
                $oldScheduledTime = $post?->scheduled_time;
                $scheduledTimeChanged = !$isUpdate || $oldScheduledTime != $scheduledTime;
                if ($scheduledTimeChanged && now('Africa/Cairo')->gt($scheduledTime)) {
                    $validator->errors()->add(
                        'scheduled_time',
                        'The scheduled time cannot be in the past.'
                    );
                }
            }
        });
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
