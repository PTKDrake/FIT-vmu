import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
export const show = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pages/{page}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
show.url = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { page: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.slug
        : args.page,
    }

    return show.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
show.get = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
show.head = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
const showForm = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
showForm.get = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/pages/{page}'
*/
showForm.head = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const pages = {
    show: Object.assign(show, show),
}

export default pages