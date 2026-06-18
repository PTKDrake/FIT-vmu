import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
 * @route '/cms/layouts/{siteLayout}'
 */
const UpdateSiteLayoutController = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: UpdateSiteLayoutController.url(args, options),
  method: "patch",
});

UpdateSiteLayoutController.definition = {
  methods: ["patch"],
  url: "/cms/layouts/{siteLayout}",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
 * @route '/cms/layouts/{siteLayout}'
 */
UpdateSiteLayoutController.url = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { siteLayout: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { siteLayout: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      siteLayout: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    siteLayout:
      typeof args.siteLayout === "object"
        ? args.siteLayout.id
        : args.siteLayout,
  };

  return (
    UpdateSiteLayoutController.definition.url
      .replace("{siteLayout}", parsedArgs.siteLayout.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
 * @route '/cms/layouts/{siteLayout}'
 */
UpdateSiteLayoutController.patch = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: UpdateSiteLayoutController.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
 * @route '/cms/layouts/{siteLayout}'
 */
const UpdateSiteLayoutControllerForm = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: UpdateSiteLayoutController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/UpdateSiteLayoutController.php:15
 * @route '/cms/layouts/{siteLayout}'
 */
UpdateSiteLayoutControllerForm.patch = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: UpdateSiteLayoutController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

UpdateSiteLayoutController.form = UpdateSiteLayoutControllerForm;

export default UpdateSiteLayoutController;
