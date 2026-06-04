import HomeController from './HomeController'
import DashboardController from './DashboardController'
import Cms from './Cms'
import Settings from './Settings'
import Auth from './Auth'
import PublicPostController from './PublicPostController'
import PublicSlugController from './PublicSlugController'

const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    Cms: Object.assign(Cms, Cms),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
    PublicPostController: Object.assign(PublicPostController, PublicPostController),
    PublicSlugController: Object.assign(PublicSlugController, PublicSlugController),
}

export default Controllers