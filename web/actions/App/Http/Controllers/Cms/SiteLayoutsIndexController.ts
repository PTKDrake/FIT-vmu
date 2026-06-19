import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
const SiteLayoutsIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SiteLayoutsIndexController.url(options),
    method: 'get',
})

SiteLayoutsIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/layouts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
SiteLayoutsIndexController.url = (options?: RouteQueryOptions) => {
    return SiteLayoutsIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
SiteLayoutsIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SiteLayoutsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
SiteLayoutsIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SiteLayoutsIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
const SiteLayoutsIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SiteLayoutsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
SiteLayoutsIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SiteLayoutsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutsIndexController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutsIndexController.php:16
* @route '/cms/layouts'
*/
SiteLayoutsIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SiteLayoutsIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

SiteLayoutsIndexController.form = SiteLayoutsIndexControllerForm

export default SiteLayoutsIndexController