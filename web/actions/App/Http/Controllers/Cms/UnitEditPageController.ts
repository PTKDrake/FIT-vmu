import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
const UnitEditPageController = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: UnitEditPageController.url(args, options),
  method: "get",
});

UnitEditPageController.definition = {
  methods: ["get", "head"],
  url: "/cms/units/{unit}/edit",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
UnitEditPageController.url = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { unit: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { unit: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      unit: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    unit: typeof args.unit === "object" ? args.unit.id : args.unit,
  };

  return (
    UnitEditPageController.definition.url
      .replace("{unit}", parsedArgs.unit.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
UnitEditPageController.get = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: UnitEditPageController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
UnitEditPageController.head = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: UnitEditPageController.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
const UnitEditPageControllerForm = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UnitEditPageController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
UnitEditPageControllerForm.get = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UnitEditPageController.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\Cms\UnitEditPageController::__invoke
 * @see app/Http/Controllers/Cms/UnitEditPageController.php:13
 * @route '/cms/units/{unit}/edit'
 */
UnitEditPageControllerForm.head = (
  args:
    | { unit: number | { id: number } }
    | [unit: number | { id: number }]
    | number
    | { id: number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: UnitEditPageController.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

UnitEditPageController.form = UnitEditPageControllerForm;

export default UnitEditPageController;
