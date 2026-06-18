import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
const StoreRoleController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreRoleController.url(options),
  method: "post",
});

StoreRoleController.definition = {
  methods: ["post"],
  url: "/cms/roles-permissions",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
StoreRoleController.url = (options?: RouteQueryOptions) => {
  return StoreRoleController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
StoreRoleController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreRoleController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
const StoreRoleControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreRoleController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
StoreRoleControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreRoleController.url(options),
  method: "post",
});

StoreRoleController.form = StoreRoleControllerForm;

export default StoreRoleController;
