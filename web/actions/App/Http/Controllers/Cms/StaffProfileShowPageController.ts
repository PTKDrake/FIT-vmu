import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
const StaffProfileShowPageController = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StaffProfileShowPageController.url(args, options),
    method: 'get',
})

StaffProfileShowPageController.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles/{staffProfile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
StaffProfileShowPageController.url = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staffProfile: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { staffProfile: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            staffProfile: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        staffProfile: typeof args.staffProfile === 'object'
        ? args.staffProfile.id
        : args.staffProfile,
    }

    return StaffProfileShowPageController.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
StaffProfileShowPageController.get = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StaffProfileShowPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
StaffProfileShowPageController.head = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: StaffProfileShowPageController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
const StaffProfileShowPageControllerForm = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfileShowPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
StaffProfileShowPageControllerForm.get = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfileShowPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
StaffProfileShowPageControllerForm.head = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfileShowPageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

StaffProfileShowPageController.form = StaffProfileShowPageControllerForm

export default StaffProfileShowPageController