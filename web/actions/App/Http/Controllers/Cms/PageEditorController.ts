import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
const PageEditorController = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PageEditorController.url(args, options),
    method: 'get',
})

PageEditorController.definition = {
    methods: ["get","head"],
    url: '/cms/pages/{page}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
PageEditorController.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return PageEditorController.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
PageEditorController.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PageEditorController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
PageEditorController.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PageEditorController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
const PageEditorControllerForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageEditorController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
PageEditorControllerForm.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageEditorController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:17
* @route '/cms/pages/{page}/edit'
*/
PageEditorControllerForm.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageEditorController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PageEditorController.form = PageEditorControllerForm

export default PageEditorController