import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
* @route '/cms/staff-profiles/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
export const show = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles/{staffProfile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
show.url = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
show.get = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
show.head = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
const showForm = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
showForm.get = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileShowPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileShowPageController.php:13
* @route '/cms/staff-profiles/{staffProfile}'
*/
showForm.head = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
export const edit = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles/{staffProfile}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
edit.url = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
edit.get = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
edit.head = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
const editForm = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
editForm.get = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfileEditPageController::__invoke
* @see app/Http/Controllers/Cms/StaffProfileEditPageController.php:15
* @route '/cms/staff-profiles/{staffProfile}/edit'
*/
editForm.head = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/staff-profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/StoreStaffProfileController.php:15
* @route '/cms/staff-profiles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:16
* @route '/cms/staff-profiles/{staffProfile}'
*/
export const update = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/staff-profiles/{staffProfile}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:16
* @route '/cms/staff-profiles/{staffProfile}'
*/
update.url = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:16
* @route '/cms/staff-profiles/{staffProfile}'
*/
update.patch = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:16
* @route '/cms/staff-profiles/{staffProfile}'
*/
const updateForm = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/UpdateStaffProfileController.php:16
* @route '/cms/staff-profiles/{staffProfile}'
*/
updateForm.patch = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:14
* @route '/cms/staff-profiles/{staffProfile}'
*/
export const destroy = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/staff-profiles/{staffProfile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:14
* @route '/cms/staff-profiles/{staffProfile}'
*/
destroy.url = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{staffProfile}', parsedArgs.staffProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:14
* @route '/cms/staff-profiles/{staffProfile}'
*/
destroy.delete = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:14
* @route '/cms/staff-profiles/{staffProfile}'
*/
const destroyForm = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
* @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:14
* @route '/cms/staff-profiles/{staffProfile}'
*/
destroyForm.delete = (args: { staffProfile: number | { id: number } } | [staffProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const staffProfiles = {
    create: Object.assign(create, create),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default staffProfiles