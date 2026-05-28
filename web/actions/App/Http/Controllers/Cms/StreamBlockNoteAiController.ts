import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
* @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
* @route '/cms/ai/blocknote'
*/
const StreamBlockNoteAiController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StreamBlockNoteAiController.url(options),
    method: 'post',
})

StreamBlockNoteAiController.definition = {
    methods: ["post"],
    url: '/cms/ai/blocknote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
* @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
* @route '/cms/ai/blocknote'
*/
StreamBlockNoteAiController.url = (options?: RouteQueryOptions) => {
    return StreamBlockNoteAiController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
* @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
* @route '/cms/ai/blocknote'
*/
StreamBlockNoteAiController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StreamBlockNoteAiController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
* @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
* @route '/cms/ai/blocknote'
*/
const StreamBlockNoteAiControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StreamBlockNoteAiController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
* @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
* @route '/cms/ai/blocknote'
*/
StreamBlockNoteAiControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StreamBlockNoteAiController.url(options),
    method: 'post',
})

StreamBlockNoteAiController.form = StreamBlockNoteAiControllerForm

export default StreamBlockNoteAiController