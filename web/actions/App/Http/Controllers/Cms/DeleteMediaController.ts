import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
const DeleteMediaController = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: DeleteMediaController.url(args, options),
  method: "delete",
});

DeleteMediaController.definition = {
  methods: ["delete"],
  url: "/cms/media/{media}",
} satisfies RouteDefinition<["delete"]>;

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
DeleteMediaController.url = (
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
    DeleteMediaController.definition.url
      .replace("{media}", parsedArgs.media.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
DeleteMediaController.delete = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: DeleteMediaController.url(args, options),
  method: "delete",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
const DeleteMediaControllerForm = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DeleteMediaController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
DeleteMediaControllerForm.delete = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DeleteMediaController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

DeleteMediaController.form = DeleteMediaControllerForm;

export default DeleteMediaController;
