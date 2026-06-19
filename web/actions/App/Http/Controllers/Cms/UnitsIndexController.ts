import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
const UnitsIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UnitsIndexController.url(options),
    method: 'get',
})

UnitsIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
UnitsIndexController.url = (options?: RouteQueryOptions) => {
    return UnitsIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
UnitsIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UnitsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
UnitsIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: UnitsIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
const UnitsIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UnitsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
UnitsIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UnitsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
UnitsIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UnitsIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

UnitsIndexController.form = UnitsIndexControllerForm

export default UnitsIndexController