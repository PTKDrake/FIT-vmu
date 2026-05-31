import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
export const update = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/navigation/{navigation_menu}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
update.url = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{navigation_menu}', parsedArgs.navigation_menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
update.patch = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\SyncNavigationMenuTreeController::__invoke
* @see app/Http/Controllers/Cms/SyncNavigationMenuTreeController.php:15
* @route '/cms/navigation/{navigation_menu}'
*/
const updateForm = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
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
updateForm.patch = (args: { navigation_menu: number | { id: number } } | [navigation_menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const navigation = {
    update: Object.assign(update, update),
}

export default navigation