import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
 * @route '/cms/post-categories'
 */
export const store = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

store.definition = {
  methods: ["post"],
  url: "/cms/post-categories",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
 * @route '/cms/post-categories'
 */
store.url = (options?: RouteQueryOptions) => {
  return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
 * @route '/cms/post-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
 * @route '/cms/post-categories'
 */
const storeForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StorePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/StorePostCategoryController.php:14
 * @route '/cms/post-categories'
 */
storeForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
export const update = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(args, options),
  method: "patch",
});

update.definition = {
  methods: ["patch"],
  url: "/cms/post-categories/{post_category}",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
update.url = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { post_category: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { post_category: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      post_category: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    post_category:
      typeof args.post_category === "object"
        ? args.post_category.id
        : args.post_category,
  };

  return (
    update.definition.url
      .replace("{post_category}", parsedArgs.post_category.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
update.patch = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
const updateForm = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
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
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
updateForm.patch = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
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

/**
 * @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
 * @route '/cms/post-categories/{post_category}'
 */
export const destroy = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: destroy.url(args, options),
  method: "delete",
});

destroy.definition = {
  methods: ["delete"],
  url: "/cms/post-categories/{post_category}",
} satisfies RouteDefinition<["delete"]>;

/**
 * @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
 * @route '/cms/post-categories/{post_category}'
 */
destroy.url = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { post_category: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { post_category: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      post_category: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    post_category:
      typeof args.post_category === "object"
        ? args.post_category.id
        : args.post_category,
  };

  return (
    destroy.definition.url
      .replace("{post_category}", parsedArgs.post_category.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
 * @route '/cms/post-categories/{post_category}'
 */
destroy.delete = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: destroy.url(args, options),
  method: "delete",
});

/**
 * @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
 * @route '/cms/post-categories/{post_category}'
 */
const destroyForm = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
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
 * @see \App\Http\Controllers\Cms\DeletePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/DeletePostCategoryController.php:13
 * @route '/cms/post-categories/{post_category}'
 */
destroyForm.delete = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
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

const postCategories = {
  store: Object.assign(store, store),
  update: Object.assign(update, update),
  destroy: Object.assign(destroy, destroy),
};

export default postCategories;
