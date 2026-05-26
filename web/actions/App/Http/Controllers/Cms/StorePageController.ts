import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
const StorePageController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StorePageController.url(options),
    method: 'post',
})

StorePageController.definition = {
    methods: ["post"],
    url: '/cms/pages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
StorePageController.url = (options?: RouteQueryOptions) => {
    return StorePageController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
StorePageController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StorePageController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
const StorePageControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StorePageController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
StorePageControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StorePageController.url(options),
    method: 'post',
})

StorePageController.form = StorePageControllerForm

export default StorePageController