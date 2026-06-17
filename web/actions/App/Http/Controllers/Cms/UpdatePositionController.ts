import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
const UpdatePositionController = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePositionController.url(args, options),
    method: 'patch',
})

UpdatePositionController.definition = {
    methods: ["patch"],
    url: '/cms/positions/{position}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
UpdatePositionController.url = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return UpdatePositionController.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
UpdatePositionController.patch = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePositionController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
const UpdatePositionControllerForm = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePositionController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
UpdatePositionControllerForm.patch = (args: { position: string | number | { id: string | number } } | [position: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePositionController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdatePositionController.form = UpdatePositionControllerForm

export default UpdatePositionController