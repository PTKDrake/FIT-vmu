import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
const MediaIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MediaIndexController.url(options),
    method: 'get',
})

MediaIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
MediaIndexController.url = (options?: RouteQueryOptions) => {
    return MediaIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
MediaIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MediaIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
MediaIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: MediaIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
const MediaIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: MediaIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
MediaIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: MediaIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
MediaIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: MediaIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

MediaIndexController.form = MediaIndexControllerForm

export default MediaIndexController