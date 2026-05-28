import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
const PostCreatePageController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostCreatePageController.url(options),
    method: 'get',
})

PostCreatePageController.definition = {
    methods: ["get","head"],
    url: '/cms/posts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
PostCreatePageController.url = (options?: RouteQueryOptions) => {
    return PostCreatePageController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
PostCreatePageController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostCreatePageController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
PostCreatePageController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PostCreatePageController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
const PostCreatePageControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostCreatePageController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
PostCreatePageControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostCreatePageController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
PostCreatePageControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostCreatePageController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PostCreatePageController.form = PostCreatePageControllerForm

export default PostCreatePageController