import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
const StaffProfileEditPageController = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StaffProfileEditPageController.url(args, options),
    method: 'get',
})

StaffProfileEditPageController.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles/{staffProfile}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
StaffProfileEditPageController.url = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return StaffProfileEditPageController.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
StaffProfileEditPageController.get = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StaffProfileEditPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
StaffProfileEditPageController.head = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: StaffProfileEditPageController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
const StaffProfileEditPageControllerForm = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfileEditPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
StaffProfileEditPageControllerForm.get = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfileEditPageController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:17
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
StaffProfileEditPageControllerForm.head = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfileEditPageController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

StaffProfileEditPageController.form = StaffProfileEditPageControllerForm

export default StaffProfileEditPageController