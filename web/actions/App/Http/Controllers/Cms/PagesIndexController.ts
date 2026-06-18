import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
const PagesIndexController = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PagesIndexController.url(options),
  method: "get",
});

PagesIndexController.definition = {
  methods: ["get", "head"],
  url: "/cms/pages",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
PagesIndexController.url = (options?: RouteQueryOptions) => {
  return PagesIndexController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
PagesIndexController.get = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PagesIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
PagesIndexController.head = (
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: PagesIndexController.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
const PagesIndexControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PagesIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
PagesIndexControllerForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PagesIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
 * @see app/Http/Controllers/Cms/PagesIndexController.php:27
 * @route '/cms/pages'
 */
PagesIndexControllerForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PagesIndexController.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

PagesIndexController.form = PagesIndexControllerForm;

export default PagesIndexController;
