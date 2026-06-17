import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
* @route '/cms/student-groups'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/student-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
* @route '/cms/student-groups'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
* @route '/cms/student-groups'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
* @route '/cms/student-groups'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
* @route '/cms/student-groups'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
export const update = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cms/student-groups/{student_group}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
update.url = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student_group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { student_group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            student_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        student_group: typeof args.student_group === 'object'
        ? args.student_group.id
        : args.student_group,
    }

    return update.definition.url
            .replace('{student_group}', parsedArgs.student_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
update.patch = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
const updateForm = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
updateForm.patch = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
export const destroy = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/student-groups/{student_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
destroy.url = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student_group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { student_group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            student_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        student_group: typeof args.student_group === 'object'
        ? args.student_group.id
        : args.student_group,
    }

    return destroy.definition.url
            .replace('{student_group}', parsedArgs.student_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
destroy.delete = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
const destroyForm = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
destroyForm.delete = (args: { student_group: number | { id: number } } | [student_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const studentGroups = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default studentGroups