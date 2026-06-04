import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
* @route '/cms/settings'
*/
const UpdateSiteSettingsController = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateSiteSettingsController.url(options),
    method: 'patch',
})

UpdateSiteSettingsController.definition = {
    methods: ["patch"],
    url: '/cms/settings',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
* @route '/cms/settings'
*/
UpdateSiteSettingsController.url = (options?: RouteQueryOptions) => {
    return UpdateSiteSettingsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
* @route '/cms/settings'
*/
UpdateSiteSettingsController.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateSiteSettingsController.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
* @route '/cms/settings'
*/
const UpdateSiteSettingsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateSiteSettingsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
* @route '/cms/settings'
*/
UpdateSiteSettingsControllerForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateSiteSettingsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdateSiteSettingsController.form = UpdateSiteSettingsControllerForm

export default UpdateSiteSettingsController