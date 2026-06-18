import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
 * @see app/Http/Controllers/Cms/StoreMediaController.php:17
 * @route '/cms/media'
 */
export const store = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

store.definition = {
  methods: ["post"],
  url: "/cms/media",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
 * @see app/Http/Controllers/Cms/StoreMediaController.php:17
 * @route '/cms/media'
 */
store.url = (options?: RouteQueryOptions) => {
  return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
 * @see app/Http/Controllers/Cms/StoreMediaController.php:17
 * @route '/cms/media'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
 * @see app/Http/Controllers/Cms/StoreMediaController.php:17
 * @route '/cms/media'
 */
const storeForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreMediaController::__invoke
 * @see app/Http/Controllers/Cms/StoreMediaController.php:17
 * @route '/cms/media'
 */
storeForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
export const rename = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: rename.url(args, options),
  method: "patch",
});

rename.definition = {
  methods: ["patch"],
  url: "/cms/media/{media}/rename",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
rename.url = (
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
    rename.definition.url
      .replace("{media}", parsedArgs.media.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
rename.patch = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: rename.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\RenameMediaController::__invoke
 * @see app/Http/Controllers/Cms/RenameMediaController.php:15
 * @route '/cms/media/{media}/rename'
 */
const renameForm = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: rename.url(args, {
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
renameForm.patch = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: rename.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

rename.form = renameForm;

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
export const duplicate = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: duplicate.url(args, options),
  method: "post",
});

duplicate.definition = {
  methods: ["post"],
  url: "/cms/media/{media}/duplicate",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
duplicate.url = (
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
    duplicate.definition.url
      .replace("{media}", parsedArgs.media.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
duplicate.post = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: duplicate.url(args, options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
const duplicateForm = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: duplicate.url(args, options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DuplicateMediaController::__invoke
 * @see app/Http/Controllers/Cms/DuplicateMediaController.php:16
 * @route '/cms/media/{media}/duplicate'
 */
duplicateForm.post = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: duplicate.url(args, options),
  method: "post",
});

duplicate.form = duplicateForm;

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
export const destroy = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: destroy.url(args, options),
  method: "delete",
});

destroy.definition = {
  methods: ["delete"],
  url: "/cms/media/{media}",
} satisfies RouteDefinition<["delete"]>;

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
destroy.url = (
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
    destroy.definition.url
      .replace("{media}", parsedArgs.media.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
destroy.delete = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: destroy.url(args, options),
  method: "delete",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteMediaController::__invoke
 * @see app/Http/Controllers/Cms/DeleteMediaController.php:15
 * @route '/cms/media/{media}'
 */
const destroyForm = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: destroy.url(args, {
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
destroyForm.delete = (
  args:
    | { media: number | { id: number } }
    | [media: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: destroy.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

destroy.form = destroyForm;

const media = {
  store: Object.assign(store, store),
  rename: Object.assign(rename, rename),
  duplicate: Object.assign(duplicate, duplicate),
  destroy: Object.assign(destroy, destroy),
};

export default media;
