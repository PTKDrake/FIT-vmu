import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
export const show = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/categories/{post_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
show.url = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post_category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { post_category: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            post_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post_category: typeof args.post_category === 'object'
        ? args.post_category.slug
        : args.post_category,
    }

    return show.definition.url
            .replace('{post_category}', parsedArgs.post_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
show.get = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
show.head = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
const showForm = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
showForm.get = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
showForm.head = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const categories = {
    show: Object.assign(show, show),
}

export default categories