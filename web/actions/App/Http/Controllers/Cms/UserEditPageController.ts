import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
const UserEditPageController = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: UserEditPageController.url(args, options),
  method: "get",
});

UserEditPageController.definition = {
  methods: ["get", "head"],
  url: "/cms/users/{user}/edit",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
UserEditPageController.url = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { user: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { user: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      user: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    user: typeof args.user === "object" ? args.user.id : args.user,
  };

  return (
    UserEditPageController.definition.url
      .replace("{user}", parsedArgs.user.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
UserEditPageController.get = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: UserEditPageController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
UserEditPageController.head = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: UserEditPageController.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
const UserEditPageControllerForm = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UserEditPageController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
UserEditPageControllerForm.get = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UserEditPageController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UserEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UserEditPageController.php:15
 * @route '/cms/users/{user}/edit'
 */
UserEditPageControllerForm.head = (
  args:
    | { user: number | { id: number } }
    | [user: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UserEditPageController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

UserEditPageController.form = UserEditPageControllerForm;

export default UserEditPageController;
