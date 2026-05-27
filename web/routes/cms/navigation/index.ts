import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
export const show = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/navigation/{navigationMenu}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
show.url = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { navigationMenu: args }
    }

    if (Array.isArray(args)) {
        args = {
            navigationMenu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        navigationMenu: args.navigationMenu,
    }

    return show.definition.url
            .replace('{navigationMenu}', parsedArgs.navigationMenu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
show.get = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
show.head = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
const showForm = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
showForm.get = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:51
* @route '/cms/navigation/{navigationMenu}'
*/
showForm.head = (args: { navigationMenu: string | number } | [navigationMenu: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const navigation = {
    show: Object.assign(show, show),
}

export default navigation