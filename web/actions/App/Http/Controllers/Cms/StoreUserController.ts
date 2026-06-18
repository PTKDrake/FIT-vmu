import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreUserController::__invoke
 * @see app/Http/Controllers/Cms/StoreUserController.php:15
 * @route '/cms/users'
 */
const StoreUserController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreUserController.url(options),
  method: "post",
});

StoreUserController.definition = {
  methods: ["post"],
  url: "/cms/users",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreUserController::__invoke
 * @see app/Http/Controllers/Cms/StoreUserController.php:15
 * @route '/cms/users'
 */
StoreUserController.url = (options?: RouteQueryOptions) => {
  return StoreUserController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreUserController::__invoke
 * @see app/Http/Controllers/Cms/StoreUserController.php:15
 * @route '/cms/users'
 */
StoreUserController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreUserController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreUserController::__invoke
 * @see app/Http/Controllers/Cms/StoreUserController.php:15
 * @route '/cms/users'
 */
const StoreUserControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreUserController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreUserController::__invoke
 * @see app/Http/Controllers/Cms/StoreUserController.php:15
 * @route '/cms/users'
 */
StoreUserControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreUserController.url(options),
  method: "post",
});

StoreUserController.form = StoreUserControllerForm;

export default StoreUserController;
