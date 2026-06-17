import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
* @see app/Http/Controllers/Cms/UpdateRoleController.php:16
* @route '/cms/roles-permissions/{role}'
*/
const UpdateRoleController = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateRoleController.url(args, options),
    method: 'patch',
})

UpdateRoleController.definition = {
    methods: ["patch"],
    url: '/cms/roles-permissions/{role}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
* @see app/Http/Controllers/Cms/UpdateRoleController.php:16
* @route '/cms/roles-permissions/{role}'
*/
UpdateRoleController.url = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return UpdateRoleController.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
* @see app/Http/Controllers/Cms/UpdateRoleController.php:16
* @route '/cms/roles-permissions/{role}'
*/
UpdateRoleController.patch = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateRoleController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
* @see app/Http/Controllers/Cms/UpdateRoleController.php:16
* @route '/cms/roles-permissions/{role}'
*/
const UpdateRoleControllerForm = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateRoleController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
* @see app/Http/Controllers/Cms/UpdateRoleController.php:16
* @route '/cms/roles-permissions/{role}'
*/
UpdateRoleControllerForm.patch = (args: { role: string | { id: string } } | [role: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateRoleController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdateRoleController.form = UpdateRoleControllerForm

export default UpdateRoleController