import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
const UsersIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UsersIndexController.url(options),
    method: 'get',
})

UsersIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
UsersIndexController.url = (options?: RouteQueryOptions) => {
    return UsersIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
UsersIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UsersIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
UsersIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: UsersIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
const UsersIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UsersIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
UsersIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UsersIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
UsersIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UsersIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

UsersIndexController.form = UsersIndexControllerForm

export default UsersIndexController