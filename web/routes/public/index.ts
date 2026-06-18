import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../wayfinder";
/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
export const slug = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: slug.url(args, options),
  method: "get",
});

slug.definition = {
  methods: ["get", "head"],
  url: "/{slug}",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
slug.url = (
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
    slug.definition.url
      .replace("{slug}", parsedArgs.slug.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
slug.get = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: slug.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
slug.head = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: slug.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
const slugForm = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: slug.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
slugForm.get = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: slug.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicSlugController::__invoke
 * @see app/Http/Controllers/PublicSlugController.php:18
 * @route '/{slug}'
 */
slugForm.head = (
  args: { slug: string | number } | [slug: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: slug.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

slug.form = slugForm;

const publicMethod = {
  slug: Object.assign(slug, slug),
};

export default publicMethod;
