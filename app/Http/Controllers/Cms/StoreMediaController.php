<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\CreateMediaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMediaRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;

final class StoreMediaController extends Controller
{
    public function __invoke(StoreMediaRequest $request, CreateMediaAction $createMedia): RedirectResponse
    {
        $user = $request->user();
        /** @var array<int, UploadedFile> $files */
        $files = $request->file('files', []);

        abort_unless($user instanceof User, 403);
        foreach ($files as $file) {
            $createMedia($user, $file);
        }

        return to_route('cms.media')
            ->with('message', 'Đã tải media lên thành công.')
            ->with('type', 'success');
    }
}
