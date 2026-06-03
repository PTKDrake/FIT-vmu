import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
const PageCreateController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PageCreateController.url(options),
    method: 'get',
})

PageCreateController.definition = {
    methods: ["get","head"],
    url: '/cms/pages/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
PageCreateController.url = (options?: RouteQueryOptions) => {
    return PageCreateController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
PageCreateController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PageCreateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
PageCreateController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PageCreateController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
const PageCreateControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageCreateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
PageCreateControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageCreateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageCreateController::__invoke
* @see app/Http/Controllers/Cms/PageCreateController.php:15
* @route '/cms/pages/create'
*/
PageCreateControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PageCreateController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PageCreateController.form = PageCreateControllerForm

export default PageCreateController