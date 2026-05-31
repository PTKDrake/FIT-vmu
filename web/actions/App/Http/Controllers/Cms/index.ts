import PostsIndexController from './PostsIndexController'
import PagesIndexController from './PagesIndexController'
import StorePageController from './StorePageController'
import PageEditorController from './PageEditorController'
import UpdatePageMetadataController from './UpdatePageMetadataController'
import UpdatePageContentController from './UpdatePageContentController'
import ClonePageController from './ClonePageController'
import DeletePageController from './DeletePageController'
import NavigationIndexController from './NavigationIndexController'
import SyncNavigationMenuTreeController from './SyncNavigationMenuTreeController'

const Cms = {
    PostsIndexController: Object.assign(PostsIndexController, PostsIndexController),
    PagesIndexController: Object.assign(PagesIndexController, PagesIndexController),
    StorePageController: Object.assign(StorePageController, StorePageController),
    PageEditorController: Object.assign(PageEditorController, PageEditorController),
    UpdatePageMetadataController: Object.assign(UpdatePageMetadataController, UpdatePageMetadataController),
    UpdatePageContentController: Object.assign(UpdatePageContentController, UpdatePageContentController),
    ClonePageController: Object.assign(ClonePageController, ClonePageController),
    DeletePageController: Object.assign(DeletePageController, DeletePageController),
    NavigationIndexController: Object.assign(NavigationIndexController, NavigationIndexController),
    SyncNavigationMenuTreeController: Object.assign(SyncNavigationMenuTreeController, SyncNavigationMenuTreeController),
}

export default Cms