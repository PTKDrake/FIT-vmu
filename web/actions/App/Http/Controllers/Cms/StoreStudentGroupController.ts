import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
 * @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
 * @route '/cms/student-groups'
 */
const StoreStudentGroupController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreStudentGroupController.url(options),
  method: "post",
});

StoreStudentGroupController.definition = {
  methods: ["post"],
  url: "/cms/student-groups",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
 * @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
 * @route '/cms/student-groups'
 */
StoreStudentGroupController.url = (options?: RouteQueryOptions) => {
  return StoreStudentGroupController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
 * @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
 * @route '/cms/student-groups'
 */
StoreStudentGroupController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreStudentGroupController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
 * @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
 * @route '/cms/student-groups'
 */
const StoreStudentGroupControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreStudentGroupController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreStudentGroupController::__invoke
 * @see app/Http/Controllers/Cms/StoreStudentGroupController.php:17
 * @route '/cms/student-groups'
 */
StoreStudentGroupControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreStudentGroupController.url(options),
  method: "post",
});

StoreStudentGroupController.form = StoreStudentGroupControllerForm;

export default StoreStudentGroupController;
