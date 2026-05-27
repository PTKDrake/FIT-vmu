import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
const StoreStaffProfileController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StoreStaffProfileController.url(options),
    method: 'post',
})

StoreStaffProfileController.definition = {
    methods: ["post"],
    url: '/cms/staff-profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
StoreStaffProfileController.url = (options?: RouteQueryOptions) => {
    return StoreStaffProfileController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
StoreStaffProfileController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: StoreStaffProfileController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
const StoreStaffProfileControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StoreStaffProfileController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
StoreStaffProfileControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: StoreStaffProfileController.url(options),
    method: 'post',
})

StoreStaffProfileController.form = StoreStaffProfileControllerForm

export default StoreStaffProfileController