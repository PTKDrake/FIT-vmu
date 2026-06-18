import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
const SiteSettingsIndexController = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: SiteSettingsIndexController.url(options),
  method: "get",
});

SiteSettingsIndexController.definition = {
  methods: ["get", "head"],
  url: "/cms/settings",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
SiteSettingsIndexController.url = (options?: RouteQueryOptions) => {
  return SiteSettingsIndexController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
SiteSettingsIndexController.get = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: SiteSettingsIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
SiteSettingsIndexController.head = (
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: SiteSettingsIndexController.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
const SiteSettingsIndexControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: SiteSettingsIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
SiteSettingsIndexControllerForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: SiteSettingsIndexController.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\SiteSettingsIndexController::__invoke
 * @see app/Http/Controllers/Cms/SiteSettingsIndexController.php:15
 * @route '/cms/settings'
 */
SiteSettingsIndexControllerForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: SiteSettingsIndexController.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

SiteSettingsIndexController.form = SiteSettingsIndexControllerForm;

export default SiteSettingsIndexController;
