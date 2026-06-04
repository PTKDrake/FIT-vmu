import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
const PostCategoriesIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostCategoriesIndexController.url(options),
    method: 'get',
})

PostCategoriesIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/post-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
PostCategoriesIndexController.url = (options?: RouteQueryOptions) => {
    return PostCategoriesIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
PostCategoriesIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PostCategoriesIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
PostCategoriesIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PostCategoriesIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
const PostCategoriesIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostCategoriesIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
PostCategoriesIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostCategoriesIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:29
* @route '/cms/post-categories'
*/
PostCategoriesIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PostCategoriesIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PostCategoriesIndexController.form = PostCategoriesIndexControllerForm

export default PostCategoriesIndexController