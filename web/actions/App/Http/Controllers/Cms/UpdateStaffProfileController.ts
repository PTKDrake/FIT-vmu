import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:18
* @route '/cms/staff-profiles/{staffProfile}'
*/
const UpdateStaffProfileController = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateStaffProfileController.url(args, options),
    method: 'patch',
})

UpdateStaffProfileController.definition = {
    methods: ["patch"],
    url: '/cms/staff-profiles/{staffProfile}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:18
* @route '/cms/staff-profiles/{staffProfile}'
*/
UpdateStaffProfileController.url = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return UpdateStaffProfileController.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:18
* @route '/cms/staff-profiles/{staffProfile}'
*/
UpdateStaffProfileController.patch = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateStaffProfileController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:18
* @route '/cms/staff-profiles/{staffProfile}'
*/
const UpdateStaffProfileControllerForm = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateStaffProfileController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:18
* @route '/cms/staff-profiles/{staffProfile}'
*/
UpdateStaffProfileControllerForm.patch = (args: { staffProfile: string | number | { id: string | number } } | [staffProfile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateStaffProfileController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdateStaffProfileController.form = UpdateStaffProfileControllerForm

export default UpdateStaffProfileController