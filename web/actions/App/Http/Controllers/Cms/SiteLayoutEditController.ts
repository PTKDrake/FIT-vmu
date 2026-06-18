import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
const SiteLayoutEditController = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: SiteLayoutEditController.url(args, options),
  method: "get",
});

SiteLayoutEditController.definition = {
  methods: ["get", "head"],
  url: "/cms/layouts/{siteLayout}/edit",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
SiteLayoutEditController.url = (
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
    SiteLayoutEditController.definition.url
      .replace("{siteLayout}", parsedArgs.siteLayout.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
SiteLayoutEditController.get = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: SiteLayoutEditController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
SiteLayoutEditController.head = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: SiteLayoutEditController.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
const SiteLayoutEditControllerForm = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: SiteLayoutEditController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
SiteLayoutEditControllerForm.get = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: SiteLayoutEditController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\SiteLayoutEditController::__invoke
 * @see app/Http/Controllers/Cms/SiteLayoutEditController.php:16
 * @route '/cms/layouts/{siteLayout}/edit'
 */
SiteLayoutEditControllerForm.head = (
  args:
    | { siteLayout: number | { id: number } }
    | [siteLayout: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: SiteLayoutEditController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

SiteLayoutEditController.form = SiteLayoutEditControllerForm;

export default SiteLayoutEditController;
