<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin User
 *
 * @property-read string $gravatar
 */
class AuthenticatedUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email_verified_at' => $this->email_verified_at,
            'email' => $this->email,
            'gravatar' => $this->gravatar,
            'staffProfile' => $this->staffProfile ? [
                'id' => $this->staffProfile->id,
                'academic_title' => $this->staffProfile->academic_title,
                'full_name' => $this->staffProfile->full_name,
                'slug' => $this->staffProfile->slug,
                'avatar_id' => $this->staffProfile->avatar_id,
                'avatar_url' => $this->staffProfile->avatar ? Storage::disk($this->staffProfile->avatar->disk)->url($this->staffProfile->avatar->path) : null,
                'email' => $this->staffProfile->email,
                'phone' => $this->staffProfile->phone,
                'bio' => $this->staffProfile->bio,
                'bio_format' => $this->staffProfile->bio_format,
                'is_public' => $this->staffProfile->is_public,
            ] : null,
        ];
    }
}
