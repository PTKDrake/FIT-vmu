import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
export const show = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{categorySlug}/{postSlug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
show.url = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            categorySlug: args[0],
            postSlug: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categorySlug: args.categorySlug,
        postSlug: args.postSlug,
    }

    return show.definition.url
            .replace('{categorySlug}', parsedArgs.categorySlug.toString())
            .replace('{postSlug}', parsedArgs.postSlug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
show.get = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
show.head = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
const showForm = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
showForm.get = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPostController::__invoke
* @see app/Http/Controllers/PublicPostController.php:17
* @route '/{categorySlug}/{postSlug}'
*/
showForm.head = (args: { categorySlug: string | number, postSlug: string | number } | [categorySlug: string | number, postSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const publicMethod = {
    show: Object.assign(show, show),
}

export default publicMethod