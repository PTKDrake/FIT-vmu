<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\RenameMediaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\RenameMediaRequest;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;

final class RenameMediaController extends Controller
{
    public function __invoke(
        RenameMediaRequest $request,
        Media $media,
        RenameMediaAction $renameMedia,
    ): RedirectResponse {
        $renameMedia($media, (string) $request->string('name'));

        return to_route('cms.media')
            ->with('message', 'Đã đổi tên tệp.')
            ->with('type', 'success');
    }
}
