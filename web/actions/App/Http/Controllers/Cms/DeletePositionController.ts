import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
const DeletePositionController = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePositionController.url(args, options),
    method: 'delete',
})

DeletePositionController.definition = {
    methods: ["delete"],
    url: '/cms/positions/{position}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
DeletePositionController.url = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { position: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { position: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            position: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        position: typeof args.position === 'object'
        ? args.position.id
        : args.position,
    }

    return DeletePositionController.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
DeletePositionController.delete = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePositionController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
const DeletePositionControllerForm = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePositionController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
DeletePositionControllerForm.delete = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePositionController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeletePositionController.form = DeletePositionControllerForm

export default DeletePositionController