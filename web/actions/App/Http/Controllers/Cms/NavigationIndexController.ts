import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
const NavigationIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: NavigationIndexController.url(options),
    method: 'get',
})

NavigationIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/navigation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
NavigationIndexController.url = (options?: RouteQueryOptions) => {
    return NavigationIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
NavigationIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: NavigationIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
NavigationIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: NavigationIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
const NavigationIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: NavigationIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
NavigationIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: NavigationIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationIndexController::__invoke
* @see app/Http/Controllers/Cms/NavigationIndexController.php:13
* @route '/cms/navigation'
*/
NavigationIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: NavigationIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

NavigationIndexController.form = NavigationIndexControllerForm

export default NavigationIndexController