import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
const DeleteUnitController = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteUnitController.url(args, options),
    method: 'delete',
})

DeleteUnitController.definition = {
    methods: ["delete"],
    url: '/cms/units/{unit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
DeleteUnitController.url = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return DeleteUnitController.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
DeleteUnitController.delete = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteUnitController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
const DeleteUnitControllerForm = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteUnitController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
DeleteUnitControllerForm.delete = (args: { unit: number | { id: number } } | [unit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteUnitController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeleteUnitController.form = DeleteUnitControllerForm

export default DeleteUnitController