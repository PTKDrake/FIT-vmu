import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
const SiteLayoutCreateController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SiteLayoutCreateController.url(options),
    method: 'get',
})

SiteLayoutCreateController.definition = {
    methods: ["get","head"],
    url: '/cms/layouts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
SiteLayoutCreateController.url = (options?: RouteQueryOptions) => {
    return SiteLayoutCreateController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
SiteLayoutCreateController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SiteLayoutCreateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
SiteLayoutCreateController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SiteLayoutCreateController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
const SiteLayoutCreateControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SiteLayoutCreateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
SiteLayoutCreateControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SiteLayoutCreateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:12
* @route '/cms/layouts/create'
*/
SiteLayoutCreateControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SiteLayoutCreateController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

SiteLayoutCreateController.form = SiteLayoutCreateControllerForm

export default SiteLayoutCreateController