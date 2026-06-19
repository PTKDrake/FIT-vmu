import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
const UpdatePostController = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePostController.url(args, options),
    method: 'patch',
})

UpdatePostController.definition = {
    methods: ["patch"],
    url: '/cms/posts/{post}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
UpdatePostController.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return UpdatePostController.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
UpdatePostController.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePostController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
const UpdatePostControllerForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
UpdatePostControllerForm.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdatePostController.form = UpdatePostControllerForm

export default UpdatePostController