import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdatePageMetadataController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageMetadataController.php:15
* @route '/cms/pages/{page}/metadata'
*/
const UpdatePageMetadataController = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePageMetadataController.url(args, options),
    method: 'patch',
})

UpdatePageMetadataController.definition = {
    methods: ["patch"],
    url: '/cms/pages/{page}/metadata',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdatePageMetadataController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageMetadataController.php:15
* @route '/cms/pages/{page}/metadata'
*/
UpdatePageMetadataController.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return UpdatePageMetadataController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdatePageMetadataController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageMetadataController.php:15
* @route '/cms/pages/{page}/metadata'
*/
UpdatePageMetadataController.patch = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdatePageMetadataController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePageMetadataController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageMetadataController.php:15
* @route '/cms/pages/{page}/metadata'
*/
const UpdatePageMetadataControllerForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePageMetadataController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePageMetadataController::__invoke
* @see app/Http/Controllers/Cms/UpdatePageMetadataController.php:15
* @route '/cms/pages/{page}/metadata'
*/
UpdatePageMetadataControllerForm.patch = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdatePageMetadataController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdatePageMetadataController.form = UpdatePageMetadataControllerForm

export default UpdatePageMetadataController