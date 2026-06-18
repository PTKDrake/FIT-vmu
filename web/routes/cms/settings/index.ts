import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
 * @route '/cms/settings'
 */
export const update = (
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(options),
  method: "patch",
});

update.definition = {
  methods: ["patch"],
  url: "/cms/settings",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
 * @route '/cms/settings'
 */
update.url = (options?: RouteQueryOptions) => {
  return update.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
 * @route '/cms/settings'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<"patch"> => ({
  url: update.url(options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
 * @route '/cms/settings'
 */
const updateForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: update.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteSettingsController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteSettingsController.php:17
 * @route '/cms/settings'
 */
updateForm.patch = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: update.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

update.form = updateForm;

const settings = {
  update: Object.assign(update, update),
};

export default settings;
