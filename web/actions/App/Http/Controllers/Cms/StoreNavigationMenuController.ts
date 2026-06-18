import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
 * @route '/cms/navigation'
 */
const StoreNavigationMenuController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreNavigationMenuController.url(options),
  method: "post",
});

StoreNavigationMenuController.definition = {
  methods: ["post"],
  url: "/cms/navigation",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
 * @route '/cms/navigation'
 */
StoreNavigationMenuController.url = (options?: RouteQueryOptions) => {
  return StoreNavigationMenuController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
 * @route '/cms/navigation'
 */
StoreNavigationMenuController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StoreNavigationMenuController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
 * @route '/cms/navigation'
 */
const StoreNavigationMenuControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreNavigationMenuController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/StoreNavigationMenuController.php:14
 * @route '/cms/navigation'
 */
StoreNavigationMenuControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StoreNavigationMenuController.url(options),
  method: "post",
});

StoreNavigationMenuController.form = StoreNavigationMenuControllerForm;

export default StoreNavigationMenuController;
