import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
const DuplicateMediaController = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: DuplicateMediaController.url(args, options),
  method: "post",
});

DuplicateMediaController.definition = {
  methods: ["post"],
  url: "/cms/media/{media}/duplicate",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
DuplicateMediaController.url = (
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
    DuplicateMediaController.definition.url
      .replace("{media}", parsedArgs.media.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
DuplicateMediaController.post = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: DuplicateMediaController.url(args, options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
const DuplicateMediaControllerForm = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DuplicateMediaController.url(args, options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
DuplicateMediaControllerForm.post = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DuplicateMediaController.url(args, options),
  method: "post",
});

DuplicateMediaController.form = DuplicateMediaControllerForm;

export default DuplicateMediaController;
