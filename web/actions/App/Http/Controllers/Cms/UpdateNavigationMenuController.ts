import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
 * @route '/cms/navigation/{navigationMenu}'
 */
const UpdateNavigationMenuController = (
  args:
    | { navigationMenu: number | { id: number } }
    | [navigationMenu: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: UpdateNavigationMenuController.url(args, options),
  method: "patch",
});

UpdateNavigationMenuController.definition = {
  methods: ["patch"],
  url: "/cms/navigation/{navigationMenu}",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
 * @route '/cms/navigation/{navigationMenu}'
 */
UpdateNavigationMenuController.url = (
  args:
    | { navigationMenu: number | { id: number } }
    | [navigationMenu: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { navigationMenu: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { navigationMenu: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      navigationMenu: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    navigationMenu:
      typeof args.navigationMenu === "object"
        ? args.navigationMenu.id
        : args.navigationMenu,
  };

  return (
    UpdateNavigationMenuController.definition.url
      .replace("{navigationMenu}", parsedArgs.navigationMenu.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
 * @route '/cms/navigation/{navigationMenu}'
 */
UpdateNavigationMenuController.patch = (
  args:
    | { navigationMenu: number | { id: number } }
    | [navigationMenu: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: UpdateNavigationMenuController.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
 * @route '/cms/navigation/{navigationMenu}'
 */
const UpdateNavigationMenuControllerForm = (
  args:
    | { navigationMenu: number | { id: number } }
    | [navigationMenu: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: UpdateNavigationMenuController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateNavigationMenuController::__invoke
 * @see app/Http/Controllers/Cms/UpdateNavigationMenuController.php:15
 * @route '/cms/navigation/{navigationMenu}'
 */
UpdateNavigationMenuControllerForm.patch = (
  args:
    | { navigationMenu: number | { id: number } }
    | [navigationMenu: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: UpdateNavigationMenuController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

UpdateNavigationMenuController.form = UpdateNavigationMenuControllerForm;

export default UpdateNavigationMenuController;
