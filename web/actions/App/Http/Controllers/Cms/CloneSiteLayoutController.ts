import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
const CloneSiteLayoutController = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: CloneSiteLayoutController.url(args, options),
    method: 'post',
})

CloneSiteLayoutController.definition = {
    methods: ["post"],
    url: '/cms/layouts/{siteLayout}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
CloneSiteLayoutController.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return CloneSiteLayoutController.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
CloneSiteLayoutController.post = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: CloneSiteLayoutController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
const CloneSiteLayoutControllerForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: CloneSiteLayoutController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
CloneSiteLayoutControllerForm.post = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: CloneSiteLayoutController.url(args, options),
    method: 'post',
})

CloneSiteLayoutController.form = CloneSiteLayoutControllerForm

export default CloneSiteLayoutController