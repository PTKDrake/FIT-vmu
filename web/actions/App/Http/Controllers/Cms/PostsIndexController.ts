import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
const PostsIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostsIndexController.url(options),
    method: 'get',
})

PostsIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/posts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
PostsIndexController.url = (options?: RouteQueryOptions) => {
    return PostsIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
PostsIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
PostsIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PostsIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
const PostsIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
PostsIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:27
* @route '/cms/posts'
*/
PostsIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostsIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PostsIndexController.form = PostsIndexControllerForm

export default PostsIndexController