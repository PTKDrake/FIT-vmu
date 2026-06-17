import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
const PublishPostController = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: PublishPostController.url(args, options),
    method: 'patch',
})

PublishPostController.definition = {
    methods: ["patch"],
    url: '/cms/posts/{post}/publish',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
PublishPostController.url = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return PublishPostController.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
PublishPostController.patch = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: PublishPostController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
const PublishPostControllerForm = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: PublishPostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
PublishPostControllerForm.patch = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: PublishPostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

PublishPostController.form = PublishPostControllerForm

export default PublishPostController