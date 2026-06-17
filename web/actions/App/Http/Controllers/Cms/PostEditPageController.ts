import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
const PostEditPageController = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostEditPageController.url(args, options),
    method: 'get',
})

PostEditPageController.definition = {
    methods: ["get","head"],
    url: '/cms/posts/{post}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
PostEditPageController.url = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return PostEditPageController.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
PostEditPageController.get = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostEditPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
PostEditPageController.head = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PostEditPageController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
const PostEditPageControllerForm = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostEditPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
PostEditPageControllerForm.get = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostEditPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:19
* @route '/cms/posts/{post}/edit'
*/
PostEditPageControllerForm.head = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostEditPageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PostEditPageController.form = PostEditPageControllerForm

export default PostEditPageController