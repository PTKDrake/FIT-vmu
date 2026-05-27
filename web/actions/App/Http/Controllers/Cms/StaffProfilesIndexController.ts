import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
const StaffProfilesIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StaffProfilesIndexController.url(options),
    method: 'get',
})

StaffProfilesIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
StaffProfilesIndexController.url = (options?: RouteQueryOptions) => {
    return StaffProfilesIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
StaffProfilesIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StaffProfilesIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
StaffProfilesIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: StaffProfilesIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
const StaffProfilesIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfilesIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
StaffProfilesIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfilesIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:27
* @route '/cms/staff-profiles'
*/
StaffProfilesIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StaffProfilesIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

StaffProfilesIndexController.form = StaffProfilesIndexControllerForm

export default StaffProfilesIndexController