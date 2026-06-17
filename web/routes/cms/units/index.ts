import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:15
* @route '/cms/units/reorder'
*/
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reorder.url(options),
    method: 'patch',
})

reorder.definition = {
    methods: ["patch"],
    url: '/cms/units/reorder',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:15
* @route '/cms/units/reorder'
*/
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:15
* @route '/cms/units/reorder'
*/
reorder.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reorder.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:15
* @route '/cms/units/reorder'
*/
const reorderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\ReorderUnitsController::__invoke
* @see app/Http/Controllers/Cms/ReorderUnitsController.php:15
* @route '/cms/units/reorder'
*/
reorderForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

reorder.form = reorderForm

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/units/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
* @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
* @route '/cms/units/create'
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
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
export const show = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/units/{unit}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
show.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return show.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
show.get = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
show.head = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
const showForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
showForm.get = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitShowPageController::__invoke
* @see app/Http/Controllers/Cms/UnitShowPageController.php:15
* @route '/cms/units/{unit}'
*/
showForm.head = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
export const edit = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/units/{unit}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
edit.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return edit.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
edit.get = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
edit.head = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
const editForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
editForm.get = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
* @see app/Http/Controllers/Cms/UnitEditPageController.php:13
* @route '/cms/units/{unit}/edit'
*/
editForm.head = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
* @see app/Http/Controllers/Cms/StoreUnitController.php:14
* @route '/cms/units'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
* @see app/Http/Controllers/Cms/StoreUnitController.php:14
* @route '/cms/units'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
* @see app/Http/Controllers/Cms/StoreUnitController.php:14
* @route '/cms/units'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
* @see app/Http/Controllers/Cms/StoreUnitController.php:14
* @route '/cms/units'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
* @see app/Http/Controllers/Cms/StoreUnitController.php:14
* @route '/cms/units'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
export const update = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/units/{unit}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
update.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return update.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
update.patch = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
const updateForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateUnitController::__invoke
* @see app/Http/Controllers/Cms/UpdateUnitController.php:15
* @route '/cms/units/{unit}'
*/
updateForm.patch = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
export const destroy = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/units/{unit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
destroy.url = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { unit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            unit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        unit: typeof args.unit === 'object'
        ? args.unit.id
        : args.unit,
    }

    return destroy.definition.url
            .replace('{unit}', parsedArgs.unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
destroy.delete = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
const destroyForm = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteUnitController::__invoke
* @see app/Http/Controllers/Cms/DeleteUnitController.php:14
* @route '/cms/units/{unit}'
*/
destroyForm.delete = (args: { unit: string | number | { id: string | number } } | [unit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const units = {
    reorder: Object.assign(reorder, reorder),
    create: Object.assign(create, create),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default units