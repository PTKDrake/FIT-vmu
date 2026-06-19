import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
const StudentGroupsIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StudentGroupsIndexController.url(options),
    method: 'get',
})

StudentGroupsIndexController.definition = {
    methods: ["get","head"],
    url: '/cms/student-groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
StudentGroupsIndexController.url = (options?: RouteQueryOptions) => {
    return StudentGroupsIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
StudentGroupsIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StudentGroupsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
StudentGroupsIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: StudentGroupsIndexController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
const StudentGroupsIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StudentGroupsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
StudentGroupsIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StudentGroupsIndexController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StudentGroupsIndexController::__invoke
* @see app/Http/Controllers/Cms/StudentGroupsIndexController.php:16
* @route '/cms/student-groups'
*/
StudentGroupsIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: StudentGroupsIndexController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

StudentGroupsIndexController.form = StudentGroupsIndexControllerForm

export default StudentGroupsIndexController