import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/posts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCreatePageController::__invoke
* @see app/Http/Controllers/Cms/PostCreatePageController.php:14
* @route '/cms/posts/create'
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
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
export const edit = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/posts/{post}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
edit.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return edit.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
edit.get = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
edit.head = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
const editForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
editForm.get = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostEditPageController::__invoke
* @see app/Http/Controllers/Cms/PostEditPageController.php:16
* @route '/cms/posts/{post}/edit'
*/
editForm.head = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Cms\StorePostController::__invoke
* @see app/Http/Controllers/Cms/StorePostController.php:14
* @route '/cms/posts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StorePostController::__invoke
* @see app/Http/Controllers/Cms/StorePostController.php:14
* @route '/cms/posts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StorePostController::__invoke
* @see app/Http/Controllers/Cms/StorePostController.php:14
* @route '/cms/posts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePostController::__invoke
* @see app/Http/Controllers/Cms/StorePostController.php:14
* @route '/cms/posts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StorePostController::__invoke
* @see app/Http/Controllers/Cms/StorePostController.php:14
* @route '/cms/posts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
export const update = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/posts/{post}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
update.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return update.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
update.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
const updateForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdatePostController::__invoke
* @see app/Http/Controllers/Cms/UpdatePostController.php:15
* @route '/cms/posts/{post}'
*/
updateForm.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
export const publish = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: publish.url(args, options),
    method: 'patch',
})

publish.definition = {
    methods: ["patch"],
    url: '/cms/posts/{post}/publish',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
publish.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return publish.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
publish.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: publish.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
const publishForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\PublishPostController::__invoke
* @see app/Http/Controllers/Cms/PublishPostController.php:15
* @route '/cms/posts/{post}/publish'
*/
publishForm.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

publish.form = publishForm

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
export const destroy = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/posts/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
destroy.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return destroy.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
destroy.delete = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
const destroyForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeletePostController::__invoke
* @see app/Http/Controllers/Cms/DeletePostController.php:14
* @route '/cms/posts/{post}'
*/
destroyForm.delete = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const posts = {
    create: Object.assign(create, create),
    edit: Object.assign(edit, edit),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    publish: Object.assign(publish, publish),
    destroy: Object.assign(destroy, destroy),
}

export default posts