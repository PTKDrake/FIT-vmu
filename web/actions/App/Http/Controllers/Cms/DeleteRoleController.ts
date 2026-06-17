import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
* @see app/Http/Controllers/Cms/DeleteRoleController.php:21
* @route '/cms/roles-permissions/{role}'
*/
const DeleteRoleController = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteRoleController.url(args, options),
    method: 'delete',
})

DeleteRoleController.definition = {
    methods: ["delete"],
    url: '/cms/roles-permissions/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
* @see app/Http/Controllers/Cms/DeleteRoleController.php:21
* @route '/cms/roles-permissions/{role}'
*/
DeleteRoleController.url = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return DeleteRoleController.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
* @see app/Http/Controllers/Cms/DeleteRoleController.php:21
* @route '/cms/roles-permissions/{role}'
*/
DeleteRoleController.delete = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteRoleController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
* @see app/Http/Controllers/Cms/DeleteRoleController.php:21
* @route '/cms/roles-permissions/{role}'
*/
const DeleteRoleControllerForm = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteRoleController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
* @see app/Http/Controllers/Cms/DeleteRoleController.php:21
* @route '/cms/roles-permissions/{role}'
*/
DeleteRoleControllerForm.delete = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteRoleController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeleteRoleController.form = DeleteRoleControllerForm

export default DeleteRoleController