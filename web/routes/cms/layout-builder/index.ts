import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
export const sources = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sources.url(args, options),
    method: 'get',
})

sources.definition = {
    methods: ["get","head"],
    url: '/cms/layout-builder/sources/{source}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
sources.url = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sources.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
sources.get = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sources.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
sources.head = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sources.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
const sourcesForm = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sources.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
sourcesForm.get = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sources.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\LayoutBuilderSourceOptionsController::__invoke
* @see app/Http/Controllers/Cms/LayoutBuilderSourceOptionsController.php:23
* @route '/cms/layout-builder/sources/{source}'
*/
sourcesForm.head = (args: { source: string | number } | [source: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sources.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sources.form = sourcesForm

const layoutBuilder = {
    sources: Object.assign(sources, sources),
}

export default layoutBuilder