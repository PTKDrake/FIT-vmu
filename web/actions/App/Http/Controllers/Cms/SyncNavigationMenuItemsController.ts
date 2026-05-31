import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
const SyncNavigationMenuItemsController = (args: { navigationMenu: number | { id: number } } | [navigationMenu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: SyncNavigationMenuItemsController.url(args, options),
    method: 'patch',
})

SyncNavigationMenuItemsController.definition = {
    methods: ["patch"],
    url: '/cms/navigation/{navigationMenu}/items',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
SyncNavigationMenuItemsController.url = (args: { navigationMenu: number | { id: number } } | [navigationMenu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return SyncNavigationMenuItemsController.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
SyncNavigationMenuItemsController.patch = (args: { navigationMenu: number | { id: number } } | [navigationMenu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: SyncNavigationMenuItemsController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuItemsController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuItemsController.php:15
* @route '/cms/navigation/{navigationMenu}/items'
*/
const SyncNavigationMenuItemsControllerForm = (args: { navigationMenu: number | { id: number } } | [navigationMenu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: SyncNavigationMenuItemsController.url(args, {
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
SyncNavigationMenuItemsControllerForm.patch = (args: { navigationMenu: number | { id: number } } | [navigationMenu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: SyncNavigationMenuItemsController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

SyncNavigationMenuItemsController.form = SyncNavigationMenuItemsControllerForm

export default SyncNavigationMenuItemsController