import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
const LayoutBuilderSourceOptionsController = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: LayoutBuilderSourceOptionsController.url(args, options),
    method: 'get',
})

LayoutBuilderSourceOptionsController.definition = {
    methods: ["get","head"],
    url: '/cms/layout-builder/sources/{source}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
LayoutBuilderSourceOptionsController.url = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

    if (Array.isArray(args)) {
        args = {
            source: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        source: args.source,
    }

    return LayoutBuilderSourceOptionsController.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
LayoutBuilderSourceOptionsController.get = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: LayoutBuilderSourceOptionsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
LayoutBuilderSourceOptionsController.head = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: LayoutBuilderSourceOptionsController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
const LayoutBuilderSourceOptionsControllerForm = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: LayoutBuilderSourceOptionsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
LayoutBuilderSourceOptionsControllerForm.get = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: LayoutBuilderSourceOptionsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:24
* @route '/cms/layout-builder/sources/{source}'
*/
LayoutBuilderSourceOptionsControllerForm.head = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: LayoutBuilderSourceOptionsController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

LayoutBuilderSourceOptionsController.form = LayoutBuilderSourceOptionsControllerForm

export default LayoutBuilderSourceOptionsController