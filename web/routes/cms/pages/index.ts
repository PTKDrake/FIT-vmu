import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import metadata from './metadata'
import content from './content'
/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/pages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePageController::__invoke
* @see app/Http/Controllers/Cms/StorePageController.php:15
* @route '/cms/pages'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
export const edit = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/pages/{page}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
edit.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return edit.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
edit.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
edit.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
const editForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
editForm.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PageEditorController::__invoke
* @see app/Http/Controllers/Cms/PageEditorController.php:14
* @route '/cms/pages/{page}/edit'
*/
editForm.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
export const clone = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

clone.definition = {
    methods: ["post"],
    url: '/cms/pages/{page}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
clone.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return clone.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
clone.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
const cloneForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\ClonePageController::__invoke
* @see app/Http/Controllers/Cms/ClonePageController.php:16
* @route '/cms/pages/{page}/clone'
*/
cloneForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clone.url(args, options),
    method: 'post',
})

clone.form = cloneForm

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
export const destroy = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/pages/{page}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
destroy.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return destroy.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
destroy.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
const destroyForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeletePageController::__invoke
* @see app/Http/Controllers/Cms/DeletePageController.php:14
* @route '/cms/pages/{page}'
*/
destroyForm.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const pages = {
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    metadata: Object.assign(metadata, metadata),
    content: Object.assign(content, content),
    clone: Object.assign(clone, clone),
    destroy: Object.assign(destroy, destroy),
}

export default pages