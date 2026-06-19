import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
* @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
* @route '/cms/realtime/ping'
*/
export const ping = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ping.url(options),
    method: 'post',
})

ping.definition = {
    methods: ["post"],
    url: '/cms/realtime/ping',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
* @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
* @route '/cms/realtime/ping'
*/
ping.url = (options?: RouteQueryOptions) => {
    return ping.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
* @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
* @route '/cms/realtime/ping'
*/
ping.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ping.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
* @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
* @route '/cms/realtime/ping'
*/
const pingForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ping.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Cms\PingCmsRealtimeController::__invoke
* @see app/Http/Controllers/Cms/PingCmsRealtimeController.php:15
* @route '/cms/realtime/ping'
*/
pingForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ping.url(options),
    method: 'post',
})

ping.form = pingForm

const realtime = {
    ping: Object.assign(ping, ping),
}

export default realtime