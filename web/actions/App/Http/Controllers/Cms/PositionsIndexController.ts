import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
const PositionsIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PositionsIndexController.url(options),
    method: 'get',
})

PositionsIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/positions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
PositionsIndexController.url = (options?: RouteQueryOptions) => {
    return PositionsIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
PositionsIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PositionsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
PositionsIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PositionsIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
const PositionsIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PositionsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
PositionsIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PositionsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
PositionsIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PositionsIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PositionsIndexController.form = PositionsIndexControllerForm

export default PositionsIndexController