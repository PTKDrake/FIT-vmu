import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
const UnitCreatePageController = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: UnitCreatePageController.url(options),
  method: "get",
});

UnitCreatePageController.definition = {
  methods: ["get", "head"],
  url: "/cms/units/create",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
UnitCreatePageController.url = (options?: RouteQueryOptions) => {
  return UnitCreatePageController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
UnitCreatePageController.get = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: UnitCreatePageController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
UnitCreatePageController.head = (
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: UnitCreatePageController.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
const UnitCreatePageControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UnitCreatePageController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
UnitCreatePageControllerForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UnitCreatePageController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UnitCreatePageController::__invoke
 * @see app/Http/Controllers/Cms/UnitCreatePageController.php:13
 * @route '/cms/units/create'
 */
UnitCreatePageControllerForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UnitCreatePageController.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

UnitCreatePageController.form = UnitCreatePageControllerForm;

export default UnitCreatePageController;
