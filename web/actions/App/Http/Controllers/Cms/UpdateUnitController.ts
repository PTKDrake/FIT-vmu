import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
const UpdateUnitController = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateUnitController.url(args, options),
    method: 'patch',
})

UpdateUnitController.definition = {
    methods: ["patch"],
    url: '/cms/units/{unit}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
UpdateUnitController.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return UpdateUnitController.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
UpdateUnitController.patch = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateUnitController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
const UpdateUnitControllerForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateUnitController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
UpdateUnitControllerForm.patch = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateUnitController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdateUnitController.form = UpdateUnitControllerForm

export default UpdateUnitController