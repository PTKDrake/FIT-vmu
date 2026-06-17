import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
const UpdateStudentGroupController = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateStudentGroupController.url(args, options),
    method: 'patch',
})

UpdateStudentGroupController.definition = {
    methods: ["patch"],
    url: '/cms/student-groups/{student_group}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
UpdateStudentGroupController.url = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return UpdateStudentGroupController.definition.url
            .replace('{student_group}', parsedArgs.student_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
UpdateStudentGroupController.patch = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: UpdateStudentGroupController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Cms\UpdateStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/UpdateStudentGroupController.php:16
* @route '/cms/student-groups/{student_group}'
*/
const UpdateStudentGroupControllerForm = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateStudentGroupController.url(args, {
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
UpdateStudentGroupControllerForm.patch = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: UpdateStudentGroupController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

UpdateStudentGroupController.form = UpdateStudentGroupControllerForm

export default UpdateStudentGroupController