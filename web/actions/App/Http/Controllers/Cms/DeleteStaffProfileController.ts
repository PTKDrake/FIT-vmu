import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
 * @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:15
 * @route '/cms/staff-profiles/{staffProfile}'
 */
const DeleteStaffProfileController = (
  args:
    | { staffProfile: number | { id: number } }
    | [staffProfile: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: DeleteStaffProfileController.url(args, options),
  method: "delete",
});

DeleteStaffProfileController.definition = {
  methods: ["delete"],
  url: "/cms/staff-profiles/{staffProfile}",
} satisfies RouteDefinition<["delete"]>;

/**
 * @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
 * @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:15
 * @route '/cms/staff-profiles/{staffProfile}'
 */
DeleteStaffProfileController.url = (
  args:
    | { staffProfile: number | { id: number } }
    | [staffProfile: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { staffProfile: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { staffProfile: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      staffProfile: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    staffProfile:
      typeof args.staffProfile === "object"
        ? args.staffProfile.id
        : args.staffProfile,
  };

  return (
    DeleteStaffProfileController.definition.url
      .replace("{staffProfile}", parsedArgs.staffProfile.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
 * @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:15
 * @route '/cms/staff-profiles/{staffProfile}'
 */
DeleteStaffProfileController.delete = (
  args:
    | { staffProfile: number | { id: number } }
    | [staffProfile: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"delete"> => ({
  url: DeleteStaffProfileController.url(args, options),
  method: "delete",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
 * @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:15
 * @route '/cms/staff-profiles/{staffProfile}'
 */
const DeleteStaffProfileControllerForm = (
  args:
    | { staffProfile: number | { id: number } }
    | [staffProfile: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DeleteStaffProfileController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\DeleteStaffProfileController::__invoke
 * @see app/Http/Controllers/Cms/DeleteStaffProfileController.php:15
 * @route '/cms/staff-profiles/{staffProfile}'
 */
DeleteStaffProfileControllerForm.delete = (
  args:
    | { staffProfile: number | { id: number } }
    | [staffProfile: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: DeleteStaffProfileController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

DeleteStaffProfileController.form = DeleteStaffProfileControllerForm;

export default DeleteStaffProfileController;
