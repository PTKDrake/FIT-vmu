import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
const DeleteStudentGroupController = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteStudentGroupController.url(args, options),
    method: 'delete',
})

DeleteStudentGroupController.definition = {
    methods: ["delete"],
    url: '/cms/student-groups/{student_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
DeleteStudentGroupController.url = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return DeleteStudentGroupController.definition.url
            .replace('{student_group}', parsedArgs.student_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
DeleteStudentGroupController.delete = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteStudentGroupController.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Cms\DeleteStudentGroupController::__invoke
* @see app/Http/Controllers/Cms/DeleteStudentGroupController.php:13
* @route '/cms/student-groups/{student_group}'
*/
const DeleteStudentGroupControllerForm = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteStudentGroupController.url(args, {
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
DeleteStudentGroupControllerForm.delete = (args: { student_group: string | number | { id: string | number } } | [student_group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DeleteStudentGroupController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DeleteStudentGroupController.form = DeleteStudentGroupControllerForm

export default DeleteStudentGroupController