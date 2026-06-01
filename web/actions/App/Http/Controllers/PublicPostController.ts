import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
const PublicPostController = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicPostController.url(args, options),
    method: 'get',
})

PublicPostController.definition = {
    methods: ["get","head"],
    url: '/posts/{post}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
PublicPostController.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { post: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.slug
        : args.post,
    }

    return PublicPostController.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
PublicPostController.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicPostController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
PublicPostController.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PublicPostController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
const PublicPostControllerForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicPostController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
PublicPostControllerForm.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicPostController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:14
* @route '/posts/{post}'
*/
PublicPostControllerForm.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicPostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PublicPostController.form = PublicPostControllerForm

export default PublicPostController