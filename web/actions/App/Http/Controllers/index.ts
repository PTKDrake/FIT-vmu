import HomeController from './HomeController'
import PublicPageController from './PublicPageController'
import PublicPostController from './PublicPostController'
import PublicCategoryController from './PublicCategoryController'
import DashboardController from './DashboardController'
import Cms from './Cms'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
    PublicPageController: Object.assign(PublicPageController, PublicPageController),
    PublicPostController: Object.assign(PublicPostController, PublicPostController),
    PublicCategoryController: Object.assign(PublicCategoryController, PublicCategoryController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    Cms: Object.assign(Cms, Cms),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers