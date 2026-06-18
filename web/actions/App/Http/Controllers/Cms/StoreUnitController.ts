import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
 * @see app/Http/Controllers/Cms/StoreUnitController.php:14
 * @route '/cms/units'
 */
const StoreUnitController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreUnitController.url(options),
  method: "post",
});

StoreUnitController.definition = {
  methods: ["post"],
  url: "/cms/units",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
 * @see app/Http/Controllers/Cms/StoreUnitController.php:14
 * @route '/cms/units'
 */
StoreUnitController.url = (options?: RouteQueryOptions) => {
  return StoreUnitController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
 * @see app/Http/Controllers/Cms/StoreUnitController.php:14
 * @route '/cms/units'
 */
StoreUnitController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreUnitController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
 * @see app/Http/Controllers/Cms/StoreUnitController.php:14
 * @route '/cms/units'
 */
const StoreUnitControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreUnitController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreUnitController::__invoke
 * @see app/Http/Controllers/Cms/StoreUnitController.php:14
 * @route '/cms/units'
 */
StoreUnitControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreUnitController.url(options),
  method: "post",
});

StoreUnitController.form = StoreUnitControllerForm;

export default StoreUnitController;
