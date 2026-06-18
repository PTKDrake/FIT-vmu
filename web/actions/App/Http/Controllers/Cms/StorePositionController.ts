import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StorePositionController::__invoke
 * @see app/Http/Controllers/Cms/StorePositionController.php:14
 * @route '/cms/positions'
 */
const StorePositionController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StorePositionController.url(options),
  method: "post",
});

StorePositionController.definition = {
  methods: ["post"],
  url: "/cms/positions",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StorePositionController::__invoke
 * @see app/Http/Controllers/Cms/StorePositionController.php:14
 * @route '/cms/positions'
 */
StorePositionController.url = (options?: RouteQueryOptions) => {
  return StorePositionController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StorePositionController::__invoke
 * @see app/Http/Controllers/Cms/StorePositionController.php:14
 * @route '/cms/positions'
 */
StorePositionController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StorePositionController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StorePositionController::__invoke
 * @see app/Http/Controllers/Cms/StorePositionController.php:14
 * @route '/cms/positions'
 */
const StorePositionControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StorePositionController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StorePositionController::__invoke
 * @see app/Http/Controllers/Cms/StorePositionController.php:14
 * @route '/cms/positions'
 */
StorePositionControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StorePositionController.url(options),
  method: "post",
});

StorePositionController.form = StorePositionControllerForm;

export default StorePositionController;
