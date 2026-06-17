import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
const ClonePageController = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ClonePageController.url(args, options),
    method: 'post',
})

ClonePageController.definition = {
    methods: ["post"],
    url: '/cms/pages/{page}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
ClonePageController.url = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return ClonePageController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
ClonePageController.post = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ClonePageController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
const ClonePageControllerForm = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ClonePageController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
ClonePageControllerForm.post = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ClonePageController.url(args, options),
    method: 'post',
})

ClonePageController.form = ClonePageControllerForm

export default ClonePageController