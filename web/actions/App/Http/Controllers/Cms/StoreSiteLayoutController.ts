import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
const StoreSiteLayoutController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StoreSiteLayoutController.url(options),
    method: 'post',
})

StoreSiteLayoutController.definition = {
    methods: ["post"],
    url: '/cms/layouts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
StoreSiteLayoutController.url = (options?: RouteQueryOptions) => {
    return StoreSiteLayoutController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
StoreSiteLayoutController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StoreSiteLayoutController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
const StoreSiteLayoutControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StoreSiteLayoutController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
StoreSiteLayoutControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StoreSiteLayoutController.url(options),
    method: 'post',
})

StoreSiteLayoutController.form = StoreSiteLayoutControllerForm

export default StoreSiteLayoutController