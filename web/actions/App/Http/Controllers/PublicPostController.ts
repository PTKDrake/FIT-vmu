import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../wayfinder";
/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
const PublicPostController = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PublicPostController.url(args, options),
  method: "get",
});

PublicPostController.definition = {
  methods: ["get", "head"],
  url: "/{categorySlug}/{postSlug}",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
PublicPostController.url = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
) => {
  if (Array.isArray(args)) {
    args = {
      categorySlug: args[0],
      postSlug: args[1],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    categorySlug: args.categorySlug,
    postSlug: args.postSlug,
  };

  return (
    PublicPostController.definition.url
      .replace("{categorySlug}", parsedArgs.categorySlug.toString())
      .replace("{postSlug}", parsedArgs.postSlug.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
PublicPostController.get = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PublicPostController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
PublicPostController.head = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: PublicPostController.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
const PublicPostControllerForm = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PublicPostController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
PublicPostControllerForm.get = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PublicPostController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicPostController::__invoke
 * @see app/Http/Controllers/PublicPostController.php:17
 * @route '/{categorySlug}/{postSlug}'
 */
PublicPostControllerForm.head = (
  args:
    | { categorySlug: string | number; postSlug: string | number }
    | [categorySlug: string | number, postSlug: string | number],
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PublicPostController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

PublicPostController.form = PublicPostControllerForm;

export default PublicPostController;
