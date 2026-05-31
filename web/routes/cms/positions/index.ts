import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StorePositionController::__invoke
* @see app/Http/Controllers/Cms/StorePositionController.php:14
* @route '/cms/positions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/positions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StorePositionController::__invoke
* @see app/Http/Controllers/Cms/StorePositionController.php:14
* @route '/cms/positions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StorePositionController::__invoke
* @see app/Http/Controllers/Cms/StorePositionController.php:14
* @route '/cms/positions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePositionController::__invoke
* @see app/Http/Controllers/Cms/StorePositionController.php:14
* @route '/cms/positions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePositionController::__invoke
* @see app/Http/Controllers/Cms/StorePositionController.php:14
* @route '/cms/positions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
export const update = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/positions/{position}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
update.url = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
update.patch = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePositionController::__invoke
* @see app/Http/Controllers/Cms/UpdatePositionController.php:15
* @route '/cms/positions/{position}'
*/
const updateForm = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
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
updateForm.patch = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
export const destroy = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/positions/{position}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
destroy.url = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
destroy.delete = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePositionController::__invoke
* @see app/Http/Controllers/Cms/DeletePositionController.php:13
* @route '/cms/positions/{position}'
*/
const destroyForm = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
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
destroyForm.delete = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const positions = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default positions