<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\DuplicateMediaAction;
use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use RuntimeException;

final class DuplicateMediaController extends Controller
{
    public function __invoke(
        Media $media,
        DuplicateMediaAction $duplicateMedia,
    ): RedirectResponse {
        $user = request()->user();

        abort_unless($user instanceof User, 403);

        try {
            $duplicateMedia($media, $user);
        } catch (RuntimeException $exception) {
            return to_route('cms.media')
                ->with('message', $exception->getMessage())
                ->with('type', 'error');
        }

        return to_route('cms.media')
            ->with('message', 'Đã tạo bản sao tệp.')
            ->with('type', 'success');
    }
}
