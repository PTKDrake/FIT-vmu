import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
const RolesPermissionsIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RolesPermissionsIndexController.url(options),
    method: 'get',
})

RolesPermissionsIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/roles-permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
RolesPermissionsIndexController.url = (options?: RouteQueryOptions) => {
    return RolesPermissionsIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
RolesPermissionsIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RolesPermissionsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
RolesPermissionsIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RolesPermissionsIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
const RolesPermissionsIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RolesPermissionsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
RolesPermissionsIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RolesPermissionsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\RolesPermissionsIndexController::__invoke
* @see app/Http/Controllers/Cms/RolesPermissionsIndexController.php:20
* @route '/cms/roles-permissions'
*/
RolesPermissionsIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RolesPermissionsIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

RolesPermissionsIndexController.form = RolesPermissionsIndexControllerForm

export default RolesPermissionsIndexController