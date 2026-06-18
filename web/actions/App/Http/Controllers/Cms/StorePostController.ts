import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StorePostController::__invoke
 * @see app/Http/Controllers/Cms/StorePostController.php:14
 * @route '/cms/posts'
 */
const StorePostController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StorePostController.url(options),
  method: "post",
});

StorePostController.definition = {
  methods: ["post"],
  url: "/cms/posts",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StorePostController::__invoke
 * @see app/Http/Controllers/Cms/StorePostController.php:14
 * @route '/cms/posts'
 */
StorePostController.url = (options?: RouteQueryOptions) => {
  return StorePostController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StorePostController::__invoke
 * @see app/Http/Controllers/Cms/StorePostController.php:14
 * @route '/cms/posts'
 */
StorePostController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: StorePostController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StorePostController::__invoke
 * @see app/Http/Controllers/Cms/StorePostController.php:14
 * @route '/cms/posts'
 */
const StorePostControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StorePostController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StorePostController::__invoke
 * @see app/Http/Controllers/Cms/StorePostController.php:14
 * @route '/cms/posts'
 */
StorePostControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: StorePostController.url(options),
  method: "post",
});

StorePostController.form = StorePostControllerForm;

export default StorePostController;
