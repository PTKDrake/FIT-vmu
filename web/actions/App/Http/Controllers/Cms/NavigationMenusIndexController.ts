import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
const NavigationMenusIndexController = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: NavigationMenusIndexController.url(options),
  method: "get",
});

NavigationMenusIndexController.definition = {
  methods: ["get", "head"],
  url: "/cms/navigation",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
NavigationMenusIndexController.url = (options?: RouteQueryOptions) => {
  return NavigationMenusIndexController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
NavigationMenusIndexController.get = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: NavigationMenusIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
NavigationMenusIndexController.head = (
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: NavigationMenusIndexController.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
const NavigationMenusIndexControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: NavigationMenusIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
NavigationMenusIndexControllerForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: NavigationMenusIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\NavigationMenusIndexController::__invoke
 * @see app/Http/Controllers/Cms/NavigationMenusIndexController.php:14
 * @route '/cms/navigation'
 */
NavigationMenusIndexControllerForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: NavigationMenusIndexController.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

NavigationMenusIndexController.form = NavigationMenusIndexControllerForm;

export default NavigationMenusIndexController;
