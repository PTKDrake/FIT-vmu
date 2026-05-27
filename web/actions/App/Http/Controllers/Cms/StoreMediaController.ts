import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
* @see app/Http/Controllers/Cms/StoreMediaController.php:16
* @route '/cms/media'
*/
const StoreMediaController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StoreMediaController.url(options),
    method: 'post',
})

StoreMediaController.definition = {
    methods: ["post"],
    url: '/cms/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
* @see app/Http/Controllers/Cms/StoreMediaController.php:16
* @route '/cms/media'
*/
StoreMediaController.url = (options?: RouteQueryOptions) => {
    return StoreMediaController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
* @see app/Http/Controllers/Cms/StoreMediaController.php:16
* @route '/cms/media'
*/
StoreMediaController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StoreMediaController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
* @see app/Http/Controllers/Cms/StoreMediaController.php:16
* @route '/cms/media'
*/
const StoreMediaControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StoreMediaController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
* @see app/Http/Controllers/Cms/StoreMediaController.php:16
* @route '/cms/media'
*/
StoreMediaControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StoreMediaController.url(options),
    method: 'post',
})

StoreMediaController.form = StoreMediaControllerForm

export default StoreMediaController