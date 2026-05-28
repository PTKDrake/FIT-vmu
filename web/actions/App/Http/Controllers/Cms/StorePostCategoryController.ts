import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
* @route '/cms/post-categories'
*/
const StorePostCategoryController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StorePostCategoryController.url(options),
    method: 'post',
})

StorePostCategoryController.definition = {
    methods: ["post"],
    url: '/cms/post-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
* @route '/cms/post-categories'
*/
StorePostCategoryController.url = (options?: RouteQueryOptions) => {
    return StorePostCategoryController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
* @route '/cms/post-categories'
*/
StorePostCategoryController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StorePostCategoryController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
* @route '/cms/post-categories'
*/
const StorePostCategoryControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StorePostCategoryController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
* @route '/cms/post-categories'
*/
StorePostCategoryControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StorePostCategoryController.url(options),
    method: 'post',
})

StorePostCategoryController.form = StorePostCategoryControllerForm

export default StorePostCategoryController