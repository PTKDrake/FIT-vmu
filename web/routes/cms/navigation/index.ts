import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import items from './items'
/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
export const show = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/navigation/{navigationMenu}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
show.url = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { navigationMenu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { navigationMenu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            navigationMenu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        navigationMenu: typeof args.navigationMenu === 'object'
        ? args.navigationMenu.id
        : args.navigationMenu,
    }

    return show.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
show.get = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
show.head = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
const showForm = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
showForm.get = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
showForm.head = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
* @route '/cms/navigation'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/navigation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
* @route '/cms/navigation'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
* @route '/cms/navigation'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
* @route '/cms/navigation'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
* @route '/cms/navigation'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
* @route '/cms/navigation/{navigationMenu}'
*/
export const update = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/navigation/{navigationMenu}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
* @route '/cms/navigation/{navigationMenu}'
*/
update.url = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { navigationMenu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { navigationMenu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            navigationMenu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        navigationMenu: typeof args.navigationMenu === 'object'
        ? args.navigationMenu.id
        : args.navigationMenu,
    }

    return update.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
* @route '/cms/navigation/{navigationMenu}'
*/
update.patch = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
* @route '/cms/navigation/{navigationMenu}'
*/
const updateForm = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
* @route '/cms/navigation/{navigationMenu}'
*/
updateForm.patch = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
export const destroy = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/navigation/{navigationMenu}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
destroy.url = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { navigationMenu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { navigationMenu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            navigationMenu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        navigationMenu: typeof args.navigationMenu === 'object'
        ? args.navigationMenu.id
        : args.navigationMenu,
    }

    return destroy.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
destroy.delete = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
const destroyForm = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
destroyForm.delete = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const navigation = {
    show: Object.assign(show, show),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    items: Object.assign(items, items),
}

export default navigation