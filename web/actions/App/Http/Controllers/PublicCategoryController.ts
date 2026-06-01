import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
const PublicCategoryController = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicCategoryController.url(args, options),
    method: 'get',
})

PublicCategoryController.definition = {
    methods: ["get","head"],
    url: '/categories/{post_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
PublicCategoryController.url = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return PublicCategoryController.definition.url
            .replace('{post_category}', parsedArgs.post_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
PublicCategoryController.get = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicCategoryController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
PublicCategoryController.head = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PublicCategoryController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
const PublicCategoryControllerForm = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicCategoryController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
PublicCategoryControllerForm.get = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicCategoryController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicCategoryController::__invoke
* @see app/Http/Controllers/PublicCategoryController.php:14
* @route '/categories/{post_category}'
*/
PublicCategoryControllerForm.head = (args: { post_category: string | { slug: string } } | [post_category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PublicCategoryController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PublicCategoryController.form = PublicCategoryControllerForm

export default PublicCategoryController