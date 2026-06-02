import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DraftSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DraftSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/draft'
*/
const DraftSiteLayoutController = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: DraftSiteLayoutController.url(args, options),
    method: 'patch',
})

DraftSiteLayoutController.definition = {
    methods: ["patch"],
    url: '/cms/layouts/{siteLayout}/draft',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\DraftSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DraftSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/draft'
*/
DraftSiteLayoutController.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return DraftSiteLayoutController.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DraftSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DraftSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/draft'
*/
DraftSiteLayoutController.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: DraftSiteLayoutController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\DraftSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DraftSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/draft'
*/
const DraftSiteLayoutControllerForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DraftSiteLayoutController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DraftSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DraftSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/draft'
*/
DraftSiteLayoutControllerForm.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DraftSiteLayoutController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DraftSiteLayoutController.form = DraftSiteLayoutControllerForm

export default DraftSiteLayoutController