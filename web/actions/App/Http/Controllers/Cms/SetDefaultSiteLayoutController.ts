import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
const SetDefaultSiteLayoutController = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: SetDefaultSiteLayoutController.url(args, options),
    method: 'patch',
})

SetDefaultSiteLayoutController.definition = {
    methods: ["patch"],
    url: '/cms/layouts/{siteLayout}/default',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
SetDefaultSiteLayoutController.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { siteLayout: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { siteLayout: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            siteLayout: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        siteLayout: typeof args.siteLayout === 'object'
        ? args.siteLayout.id
        : args.siteLayout,
    }

    return SetDefaultSiteLayoutController.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
SetDefaultSiteLayoutController.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: SetDefaultSiteLayoutController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
const SetDefaultSiteLayoutControllerForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: SetDefaultSiteLayoutController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
SetDefaultSiteLayoutControllerForm.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: SetDefaultSiteLayoutController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

SetDefaultSiteLayoutController.form = SetDefaultSiteLayoutControllerForm

export default SetDefaultSiteLayoutController