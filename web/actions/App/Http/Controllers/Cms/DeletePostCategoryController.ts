import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
* @route '/cms/post-categories/{post_category}'
*/
const DeletePostCategoryController = (args: { post_category: string | number | { id: string | number } } | [post_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePostCategoryController.url(args, options),
    method: 'delete',
})

DeletePostCategoryController.definition = {
    methods: ["delete"],
    url: '/cms/post-categories/{post_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
* @route '/cms/post-categories/{post_category}'
*/
DeletePostCategoryController.url = (args: { post_category: string | number | { id: string | number } } | [post_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post_category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post_category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post_category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post_category: typeof args.post_category === 'object'
        ? args.post_category.id
        : args.post_category,
    }

    return DeletePostCategoryController.definition.url
            .replace('{post_category}', parsedArgs.post_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
* @route '/cms/post-categories/{post_category}'
*/
DeletePostCategoryController.delete = (args: { post_category: string | number | { id: string | number } } | [post_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePostCategoryController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
* @route '/cms/post-categories/{post_category}'
*/
const DeletePostCategoryControllerForm = (args: { post_category: string | number | { id: string | number } } | [post_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePostCategoryController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
* @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
* @route '/cms/post-categories/{post_category}'
*/
DeletePostCategoryControllerForm.delete = (args: { post_category: string | number | { id: string | number } } | [post_category: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePostCategoryController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeletePostCategoryController.form = DeletePostCategoryControllerForm

export default DeletePostCategoryController