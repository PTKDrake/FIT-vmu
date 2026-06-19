<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\DeleteMediaAction;
use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use RuntimeException;

final class DeleteMediaController extends Controller
{
    public function __invoke(Media $media, DeleteMediaAction $deleteMedia): RedirectResponse
    {
        try {
            $deleteMedia($media);
        } catch (RuntimeException $exception) {
            return to_route('cms.media')
                ->with('message', $exception->getMessage())
                ->with('type', 'error');
        }

        return to_route('cms.media')
            ->with('message', 'Đã xóa tệp.')
            ->with('type', 'success');
    }
}
