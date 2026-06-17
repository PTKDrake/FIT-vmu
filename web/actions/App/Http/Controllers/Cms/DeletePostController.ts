import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
const DeletePostController = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePostController.url(args, options),
    method: 'delete',
})

DeletePostController.definition = {
    methods: ["delete"],
    url: '/cms/posts/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
DeletePostController.url = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return DeletePostController.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
DeletePostController.delete = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePostController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
const DeletePostControllerForm = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
DeletePostControllerForm.delete = (args: { post: string | number | { id: string | number } } | [post: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePostController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeletePostController.form = DeletePostControllerForm

export default DeletePostController