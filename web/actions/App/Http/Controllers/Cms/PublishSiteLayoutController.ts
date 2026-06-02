import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PublishSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/PublishSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/publish'
*/
const PublishSiteLayoutController = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: PublishSiteLayoutController.url(args, options),
    method: 'patch',
})

PublishSiteLayoutController.definition = {
    methods: ["patch"],
    url: '/cms/layouts/{siteLayout}/publish',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\PublishSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/PublishSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/publish'
*/
PublishSiteLayoutController.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return PublishSiteLayoutController.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PublishSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/PublishSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/publish'
*/
PublishSiteLayoutController.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: PublishSiteLayoutController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\PublishSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/PublishSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/publish'
*/
const PublishSiteLayoutControllerForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: PublishSiteLayoutController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\PublishSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/PublishSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/publish'
*/
PublishSiteLayoutControllerForm.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: PublishSiteLayoutController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

PublishSiteLayoutController.form = PublishSiteLayoutControllerForm

export default PublishSiteLayoutController