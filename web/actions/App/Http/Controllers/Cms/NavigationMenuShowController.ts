import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
const NavigationMenuShowController = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: NavigationMenuShowController.url(args, options),
    method: 'get',
})

NavigationMenuShowController.definition = {
    methods: ["get","head"],
    url: '/cms/navigation/{navigationMenu}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
NavigationMenuShowController.url = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return NavigationMenuShowController.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
NavigationMenuShowController.get = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: NavigationMenuShowController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
NavigationMenuShowController.head = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: NavigationMenuShowController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
const NavigationMenuShowControllerForm = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: NavigationMenuShowController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
NavigationMenuShowControllerForm.get = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: NavigationMenuShowController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\NavigationMenuShowController::__invoke
* @see app/Http/Controllers/Cms/NavigationMenuShowController.php:17
* @route '/cms/navigation/{navigationMenu}'
*/
NavigationMenuShowControllerForm.head = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: NavigationMenuShowController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

NavigationMenuShowController.form = NavigationMenuShowControllerForm

export default NavigationMenuShowController