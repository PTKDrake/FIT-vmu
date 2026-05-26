import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
const DeletePageController = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePageController.url(args, options),
    method: 'delete',
})

DeletePageController.definition = {
    methods: ["delete"],
    url: '/cms/pages/{page}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
DeletePageController.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return DeletePageController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
DeletePageController.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeletePageController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
const DeletePageControllerForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
DeletePageControllerForm.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeletePageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeletePageController.form = DeletePageControllerForm

export default DeletePageController