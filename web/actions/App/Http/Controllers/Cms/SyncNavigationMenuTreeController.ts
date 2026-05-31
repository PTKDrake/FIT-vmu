import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
const SyncNavigationMenuTreeController = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: SyncNavigationMenuTreeController.url(args, options),
    method: 'patch',
})

SyncNavigationMenuTreeController.definition = {
    methods: ["patch"],
    url: '/cms/navigation/{navigation_menu}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
SyncNavigationMenuTreeController.url = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { navigation_menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { navigation_menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            navigation_menu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        navigation_menu: typeof args.navigation_menu === 'object'
        ? args.navigation_menu.id
        : args.navigation_menu,
    }

    return SyncNavigationMenuTreeController.definition.url
            .replace('{navigation_menu}', parsedArgs.navigation_menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
SyncNavigationMenuTreeController.patch = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: SyncNavigationMenuTreeController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
const SyncNavigationMenuTreeControllerForm = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: SyncNavigationMenuTreeController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
SyncNavigationMenuTreeControllerForm.patch = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: SyncNavigationMenuTreeController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

SyncNavigationMenuTreeController.form = SyncNavigationMenuTreeControllerForm

export default SyncNavigationMenuTreeController