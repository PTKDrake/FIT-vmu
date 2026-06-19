<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\CreateMediaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMediaRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;

final class StoreMediaController extends Controller
{
    public function __invoke(StoreMediaRequest $request, CreateMediaAction $createMedia): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        /** @var array<int, UploadedFile> $files */
        $files = $request->file('files', []);

        abort_unless($user instanceof User, 403);
        $uploadedMedia = [];
        foreach ($files as $file) {
            $uploadedMedia[] = $createMedia($user, $file);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'media' => collect($uploadedMedia)->map(fn ($media): array => [
                    'id' => $media->id,
                    'preview_url' => $media->preview_url,
                    'display_name' => $media->display_name,
                ])->all(),
            ]);
        }

        return to_route('cms.media')
            ->with('message', 'Đã tải tệp lên thành công.')
            ->with('type', 'success');
    }
}
