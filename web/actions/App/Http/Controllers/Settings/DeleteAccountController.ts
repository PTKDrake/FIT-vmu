import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/delete-account',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:17
* @route '/settings/delete-account'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::destroy
* @see app/Http/Controllers/Settings/DeleteAccountController.php:25
* @route '/settings/delete-account'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/delete-account',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::destroy
* @see app/Http/Controllers/Settings/DeleteAccountController.php:25
* @route '/settings/delete-account'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::destroy
* @see app/Http/Controllers/Settings/DeleteAccountController.php:25
* @route '/settings/delete-account'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::destroy
* @see app/Http/Controllers/Settings/DeleteAccountController.php:25
* @route '/settings/delete-account'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::destroy
* @see app/Http/Controllers/Settings/DeleteAccountController.php:25
* @route '/settings/delete-account'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const DeleteAccountController = { index, destroy }

export default DeleteAccountController