import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../wayfinder";
/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
const PublicSlugController = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PublicSlugController.url(args, options),
  method: "get",
});

PublicSlugController.definition = {
  methods: ["get", "head"],
  url: "/{slug}",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
PublicSlugController.url = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { slug: args };
  }

  if (Array.isArray(args)) {
    args = {
      slug: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    slug: args.slug,
  };

  return (
    PublicSlugController.definition.url
      .replace("{slug}", parsedArgs.slug.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
PublicSlugController.get = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: PublicSlugController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
PublicSlugController.head = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: PublicSlugController.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
const PublicSlugControllerForm = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PublicSlugController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
PublicSlugControllerForm.get = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PublicSlugController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
PublicSlugControllerForm.head = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: PublicSlugController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

PublicSlugController.form = PublicSlugControllerForm;

export default PublicSlugController;
