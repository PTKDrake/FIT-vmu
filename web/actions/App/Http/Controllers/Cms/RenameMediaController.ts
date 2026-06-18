import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
const RenameMediaController = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: RenameMediaController.url(args, options),
  method: "patch",
});

RenameMediaController.definition = {
  methods: ["patch"],
  url: "/cms/media/{media}/rename",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
RenameMediaController.url = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { media: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { media: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      media: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    media: typeof args.media === "object" ? args.media.id : args.media,
  };

  return (
    RenameMediaController.definition.url
      .replace("{media}", parsedArgs.media.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
RenameMediaController.patch = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: RenameMediaController.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
const RenameMediaControllerForm = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: RenameMediaController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
RenameMediaControllerForm.patch = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: RenameMediaController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

RenameMediaController.form = RenameMediaControllerForm;

export default RenameMediaController;
