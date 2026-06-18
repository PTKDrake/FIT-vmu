import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
 * @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
 * @route '/cms/realtime/ping'
 */
const PingCmsRealtimeController = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: PingCmsRealtimeController.url(options),
  method: "post",
});

PingCmsRealtimeController.definition = {
  methods: ["post"],
  url: "/cms/realtime/ping",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
 * @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
 * @route '/cms/realtime/ping'
 */
PingCmsRealtimeController.url = (options?: RouteQueryOptions) => {
  return PingCmsRealtimeController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
 * @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
 * @route '/cms/realtime/ping'
 */
PingCmsRealtimeController.post = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: PingCmsRealtimeController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
 * @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
 * @route '/cms/realtime/ping'
 */
const PingCmsRealtimeControllerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: PingCmsRealtimeController.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
 * @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
 * @route '/cms/realtime/ping'
 */
PingCmsRealtimeControllerForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: PingCmsRealtimeController.url(options),
  method: "post",
});

PingCmsRealtimeController.form = PingCmsRealtimeControllerForm;

export default PingCmsRealtimeController;
