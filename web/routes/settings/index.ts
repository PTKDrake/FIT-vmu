import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
export const appearance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appearance.url(options),
    method: 'get',
})

appearance.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
appearance.url = (options?: RouteQueryOptions) => {
    return appearance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
appearance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appearance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
appearance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: appearance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
const appearanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appearance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
appearanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appearance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppearanceController::__invoke
* @see app/Http/Controllers/Settings/AppearanceController.php:9
* @route '/settings/appearance'
*/
appearanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appearance.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

appearance.form = appearanceForm

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
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
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
* @route '/settings/delete-account'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
* @route '/settings/delete-account'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
* @route '/settings/delete-account'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
* @route '/settings/delete-account'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
* @route '/settings/delete-account'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::index
* @see app/Http/Controllers/Settings/DeleteAccountController.php:15
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
* @see \App\Http\Controllers\Settings\DeleteAccountController::deleteAccount
* @see app/Http/Controllers/Settings/DeleteAccountController.php:23
* @route '/settings/delete-account'
*/
export const deleteAccount = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteAccount.url(options),
    method: 'delete',
})

deleteAccount.definition = {
    methods: ["delete"],
    url: '/settings/delete-account',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::deleteAccount
* @see app/Http/Controllers/Settings/DeleteAccountController.php:23
* @route '/settings/delete-account'
*/
deleteAccount.url = (options?: RouteQueryOptions) => {
    return deleteAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::deleteAccount
* @see app/Http/Controllers/Settings/DeleteAccountController.php:23
* @route '/settings/delete-account'
*/
deleteAccount.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteAccount.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::deleteAccount
* @see app/Http/Controllers/Settings/DeleteAccountController.php:23
* @route '/settings/delete-account'
*/
const deleteAccountForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteAccount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\DeleteAccountController::deleteAccount
* @see app/Http/Controllers/Settings/DeleteAccountController.php:23
* @route '/settings/delete-account'
*/
deleteAccountForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteAccount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteAccount.form = deleteAccountForm

const settings = {
    appearance: Object.assign(appearance, appearance),
    index: Object.assign(index, index),
    deleteAccount: Object.assign(deleteAccount, deleteAccount),
}

export default settings