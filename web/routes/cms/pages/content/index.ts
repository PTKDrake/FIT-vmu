import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
 * @route '/cms/pages/{page}/content'
 */
export const update = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(args, options),
  method: "patch",
});

update.definition = {
  methods: ["patch"],
  url: "/cms/pages/{page}/content",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
 * @route '/cms/pages/{page}/content'
 */
update.url = (
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
    update.definition.url
      .replace("{page}", parsedArgs.page.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
 * @route '/cms/pages/{page}/content'
 */
update.patch = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
 * @route '/cms/pages/{page}/content'
 */
const updateForm = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: update.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\UpdatePageContentController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePageContentController.php:15
 * @route '/cms/pages/{page}/content'
 */
updateForm.patch = (
  args:
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: update.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

update.form = updateForm;

const content = {
  update: Object.assign(update, update),
};

export default content;
