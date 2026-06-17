import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
const DeleteNavigationMenuController = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteNavigationMenuController.url(args, options),
    method: 'delete',
})

DeleteNavigationMenuController.definition = {
    methods: ["delete"],
    url: '/cms/navigation/{navigationMenu}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
DeleteNavigationMenuController.url = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return DeleteNavigationMenuController.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
DeleteNavigationMenuController.delete = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteNavigationMenuController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteNavigationMenuController::__invoke
* @see app/Http/Controllers/Cms/DeleteNavigationMenuController.php:14
* @route '/cms/navigation/{navigationMenu}'
*/
const DeleteNavigationMenuControllerForm = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteNavigationMenuController.url(args, {
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
DeleteNavigationMenuControllerForm.delete = (args: { navigationMenu: string | number | { id: string | number } } | [navigationMenu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteNavigationMenuController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeleteNavigationMenuController.form = DeleteNavigationMenuControllerForm

export default DeleteNavigationMenuController