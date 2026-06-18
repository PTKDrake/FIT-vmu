import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
export const store = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

store.definition = {
  methods: ["post"],
  url: "/cms/roles-permissions",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
store.url = (options?: RouteQueryOptions) => {
  return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
const storeForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StoreRoleController::__invoke
 * @see app/Http/Controllers/Cms/StoreRoleController.php:15
 * @route '/cms/roles-permissions'
 */
storeForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
 * @see app/Http/Controllers/Cms/UpdateRoleController.php:16
 * @route '/cms/roles-permissions/{role}'
 */
export const update = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(args, options),
  method: "patch",
});

update.definition = {
  methods: ["patch"],
  url: "/cms/roles-permissions/{role}",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
 * @see app/Http/Controllers/Cms/UpdateRoleController.php:16
 * @route '/cms/roles-permissions/{role}'
 */
update.url = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { role: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { role: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      role: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    role: typeof args.role === "object" ? args.role.id : args.role,
  };

  return (
    update.definition.url
      .replace("{role}", parsedArgs.role.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
 * @see app/Http/Controllers/Cms/UpdateRoleController.php:16
 * @route '/cms/roles-permissions/{role}'
 */
update.patch = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: update.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
 * @see app/Http/Controllers/Cms/UpdateRoleController.php:16
 * @route '/cms/roles-permissions/{role}'
 */
const updateForm = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
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
 * @see \App\Http\Controllers\Cms\UpdateRoleController::__invoke
 * @see app/Http/Controllers/Cms/UpdateRoleController.php:16
 * @route '/cms/roles-permissions/{role}'
 */
updateForm.patch = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
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
 * @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
 * @see app/Http/Controllers/Cms/DeleteRoleController.php:21
 * @route '/cms/roles-permissions/{role}'
 */
export const deleteMethod = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: deleteMethod.url(args, options),
  method: "delete",
});

deleteMethod.definition = {
  methods: ["delete"],
  url: "/cms/roles-permissions/{role}",
} satisfies RouteDefinition<["delete"]>;

/**
 * @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
 * @see app/Http/Controllers/Cms/DeleteRoleController.php:21
 * @route '/cms/roles-permissions/{role}'
 */
deleteMethod.url = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { role: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { role: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      role: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    role: typeof args.role === "object" ? args.role.id : args.role,
  };

  return (
    deleteMethod.definition.url
      .replace("{role}", parsedArgs.role.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
 * @see app/Http/Controllers/Cms/DeleteRoleController.php:21
 * @route '/cms/roles-permissions/{role}'
 */
deleteMethod.delete = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: deleteMethod.url(args, options),
  method: "delete",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
 * @see app/Http/Controllers/Cms/DeleteRoleController.php:21
 * @route '/cms/roles-permissions/{role}'
 */
const deleteMethodForm = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: deleteMethod.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteRoleController::__invoke
 * @see app/Http/Controllers/Cms/DeleteRoleController.php:21
 * @route '/cms/roles-permissions/{role}'
 */
deleteMethodForm.delete = (
  args:
    | { role: number | { id: number } }
    | [role: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: deleteMethod.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

deleteMethod.form = deleteMethodForm;

const rolesPermissions = {
  store: Object.assign(store, store),
  update: Object.assign(update, update),
  delete: Object.assign(deleteMethod, deleteMethod),
};

export default rolesPermissions;
