import HomeController from './HomeController'
import DashboardController from './DashboardController'
import Cms from './Cms'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    Cms: Object.assign(Cms, Cms),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers