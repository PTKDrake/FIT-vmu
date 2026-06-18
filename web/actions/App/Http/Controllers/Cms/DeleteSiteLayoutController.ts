import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
 * @route '/cms/layouts/{siteLayout}'
 */
const DeleteSiteLayoutController = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: DeleteSiteLayoutController.url(args, options),
  method: "delete",
});

DeleteSiteLayoutController.definition = {
  methods: ["delete"],
  url: "/cms/layouts/{siteLayout}",
} satisfies RouteDefinition<["delete"]>;

/**
 * @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
 * @route '/cms/layouts/{siteLayout}'
 */
DeleteSiteLayoutController.url = (
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
    DeleteSiteLayoutController.definition.url
      .replace("{siteLayout}", parsedArgs.siteLayout.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
 * @route '/cms/layouts/{siteLayout}'
 */
DeleteSiteLayoutController.delete = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: DeleteSiteLayoutController.url(args, options),
  method: "delete",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
 * @route '/cms/layouts/{siteLayout}'
 */
const DeleteSiteLayoutControllerForm = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DeleteSiteLayoutController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteSiteLayoutController::__invoke
 * @see app/Http/Controllers/Cms/DeleteSiteLayoutController.php:14
 * @route '/cms/layouts/{siteLayout}'
 */
DeleteSiteLayoutControllerForm.delete = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DeleteSiteLayoutController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

DeleteSiteLayoutController.form = DeleteSiteLayoutControllerForm;

export default DeleteSiteLayoutController;
