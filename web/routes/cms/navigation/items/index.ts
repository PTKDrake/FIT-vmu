import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
export const sync = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: sync.url(args, options),
    method: 'patch',
})

sync.definition = {
    methods: ["patch"],
    url: '/cms/navigation/{navigationMenu}/items',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
sync.url = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return sync.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
sync.patch = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: sync.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
const syncForm = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
syncForm.patch = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

sync.form = syncForm

const items = {
    sync: Object.assign(sync, sync),
}

export default items