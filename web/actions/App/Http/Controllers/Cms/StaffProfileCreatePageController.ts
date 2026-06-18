import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
const StaffProfileCreatePageController = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: StaffProfileCreatePageController.url(options),
  method: "get",
});

StaffProfileCreatePageController.definition = {
  methods: ["get", "head"],
  url: "/cms/staff-profiles/create",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
StaffProfileCreatePageController.url = (options?: RouteQueryOptions) => {
  return StaffProfileCreatePageController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
StaffProfileCreatePageController.get = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: StaffProfileCreatePageController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
StaffProfileCreatePageController.head = (
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: StaffProfileCreatePageController.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
const StaffProfileCreatePageControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: StaffProfileCreatePageController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
StaffProfileCreatePageControllerForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: StaffProfileCreatePageController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\StaffProfileCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/StaffProfileCreatePageController.php:15
 * @route '/cms/staff-profiles/create'
 */
StaffProfileCreatePageControllerForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: StaffProfileCreatePageController.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

StaffProfileCreatePageController.form = StaffProfileCreatePageControllerForm;

export default StaffProfileCreatePageController;
