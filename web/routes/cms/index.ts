import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import realtime from './realtime'
import postsD8dc7a from './posts'
import postCategories09c74a from './post-categories'
import pagesAf6a29 from './pages'
import navigation2b63fc from './navigation'
import media30b75d from './media'
import ai from './ai'
import staffProfilesB92b14 from './staff-profiles'
import unitsD09b1b from './units'
import positions7be47e from './positions'
import users48860f from './users'
/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/cms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:16
* @route '/cms'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
export const posts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: posts.url(options),
    method: 'get',
})

posts.definition = {
    methods: ["get","head"],
    url: '/cms/posts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
posts.url = (options?: RouteQueryOptions) => {
    return posts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
posts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: posts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
posts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: posts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
const postsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: posts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
postsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: posts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostsIndexController::__invoke
* @see app/Http/Controllers/Cms/PostsIndexController.php:28
* @route '/cms/posts'
*/
postsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: posts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

posts.form = postsForm

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
export const postCategories = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: postCategories.url(options),
    method: 'get',
})

postCategories.definition = {
    methods: ["get","head"],
    url: '/cms/post-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
postCategories.url = (options?: RouteQueryOptions) => {
    return postCategories.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
postCategories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: postCategories.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
postCategories.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: postCategories.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
const postCategoriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: postCategories.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
postCategoriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: postCategories.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PostCategoriesIndexController::__invoke
* @see app/Http/Controllers/Cms/PostCategoriesIndexController.php:27
* @route '/cms/post-categories'
*/
postCategoriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: postCategories.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

postCategories.form = postCategoriesForm

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
export const pages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pages.url(options),
    method: 'get',
})

pages.definition = {
    methods: ["get","head"],
    url: '/cms/pages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
pages.url = (options?: RouteQueryOptions) => {
    return pages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
pages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
pages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pages.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
const pagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
pagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PagesIndexController::__invoke
* @see app/Http/Controllers/Cms/PagesIndexController.php:27
* @route '/cms/pages'
*/
pagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pages.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pages.form = pagesForm

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
export const navigation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: navigation.url(options),
    method: 'get',
})

navigation.definition = {
    methods: ["get","head"],
    url: '/cms/navigation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
navigation.url = (options?: RouteQueryOptions) => {
    return navigation.definition.url + queryParams(options)
}

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
navigation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: navigation.url(options),
    method: 'get',
})

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
navigation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: navigation.url(options),
    method: 'head',
})

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
const navigationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: navigation.url(options),
    method: 'get',
})

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
navigationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: navigation.url(options),
    method: 'get',
})

/**
* @see routes/web.php:93
* @route '/cms/navigation'
*/
navigationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: navigation.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

navigation.form = navigationForm

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
export const media = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: media.url(options),
    method: 'get',
})

media.definition = {
    methods: ["get","head"],
    url: '/cms/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
media.url = (options?: RouteQueryOptions) => {
    return media.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
media.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: media.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
media.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: media.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
const mediaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: media.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
mediaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: media.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\MediaIndexController::__invoke
* @see app/Http/Controllers/Cms/MediaIndexController.php:33
* @route '/cms/media'
*/
mediaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: media.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

media.form = mediaForm

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
export const documents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documents.url(options),
    method: 'get',
})

documents.definition = {
    methods: ["get","head"],
    url: '/cms/documents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
documents.url = (options?: RouteQueryOptions) => {
    return documents.definition.url + queryParams(options)
}

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
documents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documents.url(options),
    method: 'get',
})

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
documents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: documents.url(options),
    method: 'head',
})

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
const documentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: documents.url(options),
    method: 'get',
})

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
documentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: documents.url(options),
    method: 'get',
})

/**
* @see routes/web.php:122
* @route '/cms/documents'
*/
documentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: documents.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

documents.form = documentsForm

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
export const staffProfiles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: staffProfiles.url(options),
    method: 'get',
})

staffProfiles.definition = {
    methods: ["get","head"],
    url: '/cms/staff-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
staffProfiles.url = (options?: RouteQueryOptions) => {
    return staffProfiles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
staffProfiles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: staffProfiles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
staffProfiles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: staffProfiles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
const staffProfilesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: staffProfiles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
staffProfilesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: staffProfiles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\StaffProfilesIndexController::__invoke
* @see app/Http/Controllers/Cms/StaffProfilesIndexController.php:28
* @route '/cms/staff-profiles'
*/
staffProfilesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: staffProfiles.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

staffProfiles.form = staffProfilesForm

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
export const units = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: units.url(options),
    method: 'get',
})

units.definition = {
    methods: ["get","head"],
    url: '/cms/units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
units.url = (options?: RouteQueryOptions) => {
    return units.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
units.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: units.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
units.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: units.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
const unitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: units.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
unitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: units.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UnitsIndexController::__invoke
* @see app/Http/Controllers/Cms/UnitsIndexController.php:15
* @route '/cms/units'
*/
unitsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: units.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

units.form = unitsForm

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
export const positions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: positions.url(options),
    method: 'get',
})

positions.definition = {
    methods: ["get","head"],
    url: '/cms/positions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
positions.url = (options?: RouteQueryOptions) => {
    return positions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
positions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: positions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
positions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: positions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
const positionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: positions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
positionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: positions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\PositionsIndexController::__invoke
* @see app/Http/Controllers/Cms/PositionsIndexController.php:27
* @route '/cms/positions'
*/
positionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: positions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

positions.form = positionsForm

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/cms/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Cms\UsersIndexController::__invoke
* @see app/Http/Controllers/Cms/UsersIndexController.php:28
* @route '/cms/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
export const rolesPermissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rolesPermissions.url(options),
    method: 'get',
})

rolesPermissions.definition = {
    methods: ["get","head"],
    url: '/cms/roles-permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
rolesPermissions.url = (options?: RouteQueryOptions) => {
    return rolesPermissions.definition.url + queryParams(options)
}

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
rolesPermissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rolesPermissions.url(options),
    method: 'get',
})

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
rolesPermissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rolesPermissions.url(options),
    method: 'head',
})

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
const rolesPermissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rolesPermissions.url(options),
    method: 'get',
})

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
rolesPermissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rolesPermissions.url(options),
    method: 'get',
})

/**
* @see routes/web.php:201
* @route '/cms/roles-permissions'
*/
rolesPermissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rolesPermissions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

rolesPermissions.form = rolesPermissionsForm

const cms = {
    dashboard: Object.assign(dashboard, dashboard),
    realtime: Object.assign(realtime, realtime),
    posts: Object.assign(posts, postsD8dc7a),
    postCategories: Object.assign(postCategories, postCategories09c74a),
    pages: Object.assign(pages, pagesAf6a29),
    navigation: Object.assign(navigation, navigation2b63fc),
    media: Object.assign(media, media30b75d),
    ai: Object.assign(ai, ai),
    documents: Object.assign(documents, documents),
    staffProfiles: Object.assign(staffProfiles, staffProfilesB92b14),
    units: Object.assign(units, unitsD09b1b),
    positions: Object.assign(positions, positions7be47e),
    users: Object.assign(users, users48860f),
    rolesPermissions: Object.assign(rolesPermissions, rolesPermissions),
}

export default cms