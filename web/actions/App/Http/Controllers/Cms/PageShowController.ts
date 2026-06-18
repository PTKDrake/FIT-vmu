import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
const PageShowController = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PageShowController.url(args, options),
  method: "get",
});

PageShowController.definition = {
  methods: ["get", "head"],
  url: "/cms/pages/{page}/show",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
PageShowController.url = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { page: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { page: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      page: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    page: typeof args.page === "object" ? args.page.id : args.page,
  };

  return (
    PageShowController.definition.url
      .replace("{page}", parsedArgs.page.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
PageShowController.get = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PageShowController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
PageShowController.head = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: PageShowController.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
const PageShowControllerForm = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PageShowController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
PageShowControllerForm.get = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PageShowController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\PageShowController::__invoke
 * @see app/Http/Controllers/Cms/PageShowController.php:14
 * @route '/cms/pages/{page}/show'
 */
PageShowControllerForm.head = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PageShowController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

PageShowController.form = PageShowControllerForm;

export default PageShowController;
