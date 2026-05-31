import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
const UserCreatePageController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UserCreatePageController.url(options),
    method: 'get',
})

UserCreatePageController.definition = {
    methods: ["get","head"],
    url: '/cms/users/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
UserCreatePageController.url = (options?: RouteQueryOptions) => {
    return UserCreatePageController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
UserCreatePageController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UserCreatePageController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
UserCreatePageController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: UserCreatePageController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
const UserCreatePageControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UserCreatePageController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
UserCreatePageControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UserCreatePageController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UserCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UserCreatePageController.php:13
* @route '/cms/users/create'
*/
UserCreatePageControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UserCreatePageController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

UserCreatePageController.form = UserCreatePageControllerForm

export default UserCreatePageController