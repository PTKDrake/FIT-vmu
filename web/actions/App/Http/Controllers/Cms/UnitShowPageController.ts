import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
const UnitShowPageController = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UnitShowPageController.url(args, options),
    method: 'get',
})

UnitShowPageController.definition = {
    methods: ["get","head"],
    url: '/cms/units/{unit}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
UnitShowPageController.url = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return UnitShowPageController.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
UnitShowPageController.get = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UnitShowPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
UnitShowPageController.head = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: UnitShowPageController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
const UnitShowPageControllerForm = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UnitShowPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
UnitShowPageControllerForm.get = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UnitShowPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
UnitShowPageControllerForm.head = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UnitShowPageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

UnitShowPageController.form = UnitShowPageControllerForm

export default UnitShowPageController