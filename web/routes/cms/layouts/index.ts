import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/layouts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutCreateController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutCreateController.php:14
* @route '/cms/layouts/create'
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
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/layouts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/StoreSiteLayoutController.php:14
* @route '/cms/layouts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
export const edit = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/layouts/{siteLayout}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
edit.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { siteLayout: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { siteLayout: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            siteLayout: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        siteLayout: typeof args.siteLayout === 'object'
        ? args.siteLayout.id
        : args.siteLayout,
    }

    return edit.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
edit.get = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
edit.head = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
const editForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
editForm.get = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
* @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
* @route '/cms/layouts/{siteLayout}/edit'
*/
editForm.head = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
* @route '/cms/layouts/{siteLayout}'
*/
export const update = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/layouts/{siteLayout}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
* @route '/cms/layouts/{siteLayout}'
*/
update.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { siteLayout: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { siteLayout: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            siteLayout: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        siteLayout: typeof args.siteLayout === 'object'
        ? args.siteLayout.id
        : args.siteLayout,
    }

    return update.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
* @route '/cms/layouts/{siteLayout}'
*/
update.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
* @route '/cms/layouts/{siteLayout}'
*/
const updateForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
* @route '/cms/layouts/{siteLayout}'
*/
updateForm.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
export const clone = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

clone.definition = {
    methods: ["post"],
    url: '/cms/layouts/{siteLayout}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
clone.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { siteLayout: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { siteLayout: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            siteLayout: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        siteLayout: typeof args.siteLayout === 'object'
        ? args.siteLayout.id
        : args.siteLayout,
    }

    return clone.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
clone.post = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
const cloneForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\CloneSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/CloneSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}/clone'
*/
cloneForm.post = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clone.url(args, options),
    method: 'post',
})

clone.form = cloneForm

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
export const defaultMethod = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: defaultMethod.url(args, options),
    method: 'patch',
})

defaultMethod.definition = {
    methods: ["patch"],
    url: '/cms/layouts/{siteLayout}/default',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
defaultMethod.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { siteLayout: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { siteLayout: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            siteLayout: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        siteLayout: typeof args.siteLayout === 'object'
        ? args.siteLayout.id
        : args.siteLayout,
    }

    return defaultMethod.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
defaultMethod.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: defaultMethod.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
const defaultMethodForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: defaultMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\SetDefaultSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/SetDefaultSiteLayoutController.php:16
* @route '/cms/layouts/{siteLayout}/default'
*/
defaultMethodForm.patch = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: defaultMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

defaultMethod.form = defaultMethodForm

/**
* @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}'
*/
export const destroy = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/layouts/{siteLayout}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}'
*/
destroy.url = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { siteLayout: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { siteLayout: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            siteLayout: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        siteLayout: typeof args.siteLayout === 'object'
        ? args.siteLayout.id
        : args.siteLayout,
    }

    return destroy.definition.url
            .replace('{siteLayout}', parsedArgs.siteLayout.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}'
*/
destroy.delete = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}'
*/
const destroyForm = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
* @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
* @route '/cms/layouts/{siteLayout}'
*/
destroyForm.delete = (args: { siteLayout: number | { id: number } } | [siteLayout: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const layouts = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    clone: Object.assign(clone, clone),
    default: Object.assign(defaultMethod, defaultMethod),
    destroy: Object.assign(destroy, destroy),
}

export default layouts