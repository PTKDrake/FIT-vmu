import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:14
* @route '/cms/units/reorder'
*/
const ReorderUnitsController = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: ReorderUnitsController.url(options),
    method: 'patch',
})

ReorderUnitsController.definition = {
    methods: ["patch"],
    url: '/cms/units/reorder',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:14
* @route '/cms/units/reorder'
*/
ReorderUnitsController.url = (options?: RouteQueryOptions) => {
    return ReorderUnitsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:14
* @route '/cms/units/reorder'
*/
ReorderUnitsController.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: ReorderUnitsController.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:14
* @route '/cms/units/reorder'
*/
const ReorderUnitsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ReorderUnitsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:14
* @route '/cms/units/reorder'
*/
ReorderUnitsControllerForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ReorderUnitsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

ReorderUnitsController.form = ReorderUnitsControllerForm

export default ReorderUnitsController