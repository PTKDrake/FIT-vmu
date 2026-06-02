import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
const PublicPageController = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicPageController.url(args, options),
    method: 'get',
})

PublicPageController.definition = {
    methods: ["get","head"],
    url: '/{page}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
PublicPageController.url = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return PublicPageController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
PublicPageController.get = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
PublicPageController.head = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PublicPageController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
const PublicPageControllerForm = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
PublicPageControllerForm.get = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPageController::__invoke
* @see app/Http/Controllers/PublicPageController.php:14
* @route '/{page}'
*/
PublicPageControllerForm.head = (args: { page: string | { slug: string } } | [page: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicPageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PublicPageController.form = PublicPageControllerForm

export default PublicPageController