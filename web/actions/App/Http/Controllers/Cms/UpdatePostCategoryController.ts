import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
const UpdatePostCategoryController = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: UpdatePostCategoryController.url(args, options),
  method: "patch",
});

UpdatePostCategoryController.definition = {
  methods: ["patch"],
  url: "/cms/post-categories/{post_category}",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
UpdatePostCategoryController.url = (
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
    UpdatePostCategoryController.definition.url
      .replace("{post_category}", parsedArgs.post_category.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
UpdatePostCategoryController.patch = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: UpdatePostCategoryController.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdatePostCategoryController::__invoke
 * @see app/Http/Controllers/Cms/UpdatePostCategoryController.php:15
 * @route '/cms/post-categories/{post_category}'
 */
const UpdatePostCategoryControllerForm = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: UpdatePostCategoryController.url(args, {
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
UpdatePostCategoryControllerForm.patch = (
  args:
    | { post_category: number | { id: number } }
    | [post_category: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: UpdatePostCategoryController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

UpdatePostCategoryController.form = UpdatePostCategoryControllerForm;

export default UpdatePostCategoryController;
