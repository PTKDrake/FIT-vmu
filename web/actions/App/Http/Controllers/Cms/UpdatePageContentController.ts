import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
* @route '/cms/pages/{page}/content'
*/
const UpdatePageContentController = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePageContentController.url(args, options),
    method: 'patch',
})

UpdatePageContentController.definition = {
    methods: ["patch"],
    url: '/cms/pages/{page}/content',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
* @route '/cms/pages/{page}/content'
*/
UpdatePageContentController.url = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return UpdatePageContentController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
* @route '/cms/pages/{page}/content'
*/
UpdatePageContentController.patch = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePageContentController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
* @route '/cms/pages/{page}/content'
*/
const UpdatePageContentControllerForm = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePageContentController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
* @route '/cms/pages/{page}/content'
*/
UpdatePageContentControllerForm.patch = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePageContentController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdatePageContentController.form = UpdatePageContentControllerForm

export default UpdatePageContentController