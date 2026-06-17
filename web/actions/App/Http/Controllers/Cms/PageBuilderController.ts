import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
const PageBuilderController = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PageBuilderController.url(args, options),
    method: 'get',
})

PageBuilderController.definition = {
    methods: ["get","head"],
    url: '/cms/pages/{page}/builder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
PageBuilderController.url = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return PageBuilderController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
PageBuilderController.get = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PageBuilderController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
PageBuilderController.head = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PageBuilderController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
const PageBuilderControllerForm = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageBuilderController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
PageBuilderControllerForm.get = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageBuilderController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageBuilderController::__invoke
* @see app/Http/Controllers/Cms/PageBuilderController.php:14
* @route '/cms/pages/{page}/builder'
*/
PageBuilderControllerForm.head = (args: { page: string | number | { id: string | number } } | [page: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageBuilderController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PageBuilderController.form = PageBuilderControllerForm

export default PageBuilderController