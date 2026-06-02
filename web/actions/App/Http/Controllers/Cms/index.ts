import PingCmsRealtimeController from './PingCmsRealtimeController'
import LayoutBuilderSourceOptionsController from './LayoutBuilderSourceOptionsController'
import PostsIndexController from './PostsIndexController'
import PostCreatePageController from './PostCreatePageController'
import PostEditPageController from './PostEditPageController'
import StorePostController from './StorePostController'
import UpdatePostController from './UpdatePostController'
import PublishPostController from './PublishPostController'
import DeletePostController from './DeletePostController'
import PostCategoriesIndexController from './PostCategoriesIndexController'
import StorePostCategoryController from './StorePostCategoryController'
import UpdatePostCategoryController from './UpdatePostCategoryController'
import DeletePostCategoryController from './DeletePostCategoryController'
import PagesIndexController from './PagesIndexController'
import PageCreateController from './PageCreateController'
import StorePageController from './StorePageController'
import PageEditorController from './PageEditorController'
import PageBuilderController from './PageBuilderController'
import PageShowController from './PageShowController'
import UpdatePageMetadataController from './UpdatePageMetadataController'
import UpdatePageContentController from './UpdatePageContentController'
import ClonePageController from './ClonePageController'
import DeletePageController from './DeletePageController'
import SiteLayoutsIndexController from './SiteLayoutsIndexController'
import SiteLayoutCreateController from './SiteLayoutCreateController'
import StoreSiteLayoutController from './StoreSiteLayoutController'
import SiteLayoutEditController from './SiteLayoutEditController'
import UpdateSiteLayoutController from './UpdateSiteLayoutController'
import PublishSiteLayoutController from './PublishSiteLayoutController'
import DraftSiteLayoutController from './DraftSiteLayoutController'
import SetDefaultSiteLayoutController from './SetDefaultSiteLayoutController'
import DeleteSiteLayoutController from './DeleteSiteLayoutController'
import NavigationMenusIndexController from './NavigationMenusIndexController'
import NavigationMenuShowController from './NavigationMenuShowController'
import StoreNavigationMenuController from './StoreNavigationMenuController'
import UpdateNavigationMenuController from './UpdateNavigationMenuController'
import DeleteNavigationMenuController from './DeleteNavigationMenuController'
import SyncNavigationMenuItemsController from './SyncNavigationMenuItemsController'
import MediaIndexController from './MediaIndexController'
import StoreMediaController from './StoreMediaController'
import RenameMediaController from './RenameMediaController'
import DuplicateMediaController from './DuplicateMediaController'
import DeleteMediaController from './DeleteMediaController'
import StreamBlockNoteAiController from './StreamBlockNoteAiController'
import StaffProfilesIndexController from './StaffProfilesIndexController'
import StaffProfileCreatePageController from './StaffProfileCreatePageController'
import StaffProfileShowPageController from './StaffProfileShowPageController'
import StaffProfileEditPageController from './StaffProfileEditPageController'
import StoreStaffProfileController from './StoreStaffProfileController'
import UpdateStaffProfileController from './UpdateStaffProfileController'
import DeleteStaffProfileController from './DeleteStaffProfileController'
import UnitsIndexController from './UnitsIndexController'
import ReorderUnitsController from './ReorderUnitsController'
import UnitCreatePageController from './UnitCreatePageController'
import UnitShowPageController from './UnitShowPageController'
import UnitEditPageController from './UnitEditPageController'
import StoreUnitController from './StoreUnitController'
import UpdateUnitController from './UpdateUnitController'
import DeleteUnitController from './DeleteUnitController'
import PositionsIndexController from './PositionsIndexController'
import StorePositionController from './StorePositionController'
import UpdatePositionController from './UpdatePositionController'
import DeletePositionController from './DeletePositionController'
import UsersIndexController from './UsersIndexController'
import UserCreatePageController from './UserCreatePageController'
import StoreUserController from './StoreUserController'
import UserEditPageController from './UserEditPageController'
import UpdateUserController from './UpdateUserController'
import RolesPermissionsIndexController from './RolesPermissionsIndexController'
import StoreRoleController from './StoreRoleController'
import UpdateRoleController from './UpdateRoleController'
import DeleteRoleController from './DeleteRoleController'

const Cms = {
    PingCmsRealtimeController: Object.assign(PingCmsRealtimeController, PingCmsRealtimeController),
    LayoutBuilderSourceOptionsController: Object.assign(LayoutBuilderSourceOptionsController, LayoutBuilderSourceOptionsController),
    PostsIndexController: Object.assign(PostsIndexController, PostsIndexController),
    PostCreatePageController: Object.assign(PostCreatePageController, PostCreatePageController),
    PostEditPageController: Object.assign(PostEditPageController, PostEditPageController),
    StorePostController: Object.assign(StorePostController, StorePostController),
    UpdatePostController: Object.assign(UpdatePostController, UpdatePostController),
    PublishPostController: Object.assign(PublishPostController, PublishPostController),
    DeletePostController: Object.assign(DeletePostController, DeletePostController),
    PostCategoriesIndexController: Object.assign(PostCategoriesIndexController, PostCategoriesIndexController),
    StorePostCategoryController: Object.assign(StorePostCategoryController, StorePostCategoryController),
    UpdatePostCategoryController: Object.assign(UpdatePostCategoryController, UpdatePostCategoryController),
    DeletePostCategoryController: Object.assign(DeletePostCategoryController, DeletePostCategoryController),
    PagesIndexController: Object.assign(PagesIndexController, PagesIndexController),
    PageCreateController: Object.assign(PageCreateController, PageCreateController),
    StorePageController: Object.assign(StorePageController, StorePageController),
    PageEditorController: Object.assign(PageEditorController, PageEditorController),
    PageBuilderController: Object.assign(PageBuilderController, PageBuilderController),
    PageShowController: Object.assign(PageShowController, PageShowController),
    UpdatePageMetadataController: Object.assign(UpdatePageMetadataController, UpdatePageMetadataController),
    UpdatePageContentController: Object.assign(UpdatePageContentController, UpdatePageContentController),
    ClonePageController: Object.assign(ClonePageController, ClonePageController),
    DeletePageController: Object.assign(DeletePageController, DeletePageController),
    SiteLayoutsIndexController: Object.assign(SiteLayoutsIndexController, SiteLayoutsIndexController),
    SiteLayoutCreateController: Object.assign(SiteLayoutCreateController, SiteLayoutCreateController),
    StoreSiteLayoutController: Object.assign(StoreSiteLayoutController, StoreSiteLayoutController),
    SiteLayoutEditController: Object.assign(SiteLayoutEditController, SiteLayoutEditController),
    UpdateSiteLayoutController: Object.assign(UpdateSiteLayoutController, UpdateSiteLayoutController),
    PublishSiteLayoutController: Object.assign(PublishSiteLayoutController, PublishSiteLayoutController),
    DraftSiteLayoutController: Object.assign(DraftSiteLayoutController, DraftSiteLayoutController),
    SetDefaultSiteLayoutController: Object.assign(SetDefaultSiteLayoutController, SetDefaultSiteLayoutController),
    DeleteSiteLayoutController: Object.assign(DeleteSiteLayoutController, DeleteSiteLayoutController),
    NavigationMenusIndexController: Object.assign(NavigationMenusIndexController, NavigationMenusIndexController),
    NavigationMenuShowController: Object.assign(NavigationMenuShowController, NavigationMenuShowController),
    StoreNavigationMenuController: Object.assign(StoreNavigationMenuController, StoreNavigationMenuController),
    UpdateNavigationMenuController: Object.assign(UpdateNavigationMenuController, UpdateNavigationMenuController),
    DeleteNavigationMenuController: Object.assign(DeleteNavigationMenuController, DeleteNavigationMenuController),
    SyncNavigationMenuItemsController: Object.assign(SyncNavigationMenuItemsController, SyncNavigationMenuItemsController),
    MediaIndexController: Object.assign(MediaIndexController, MediaIndexController),
    StoreMediaController: Object.assign(StoreMediaController, StoreMediaController),
    RenameMediaController: Object.assign(RenameMediaController, RenameMediaController),
    DuplicateMediaController: Object.assign(DuplicateMediaController, DuplicateMediaController),
    DeleteMediaController: Object.assign(DeleteMediaController, DeleteMediaController),
    StreamBlockNoteAiController: Object.assign(StreamBlockNoteAiController, StreamBlockNoteAiController),
    StaffProfilesIndexController: Object.assign(StaffProfilesIndexController, StaffProfilesIndexController),
    StaffProfileCreatePageController: Object.assign(StaffProfileCreatePageController, StaffProfileCreatePageController),
    StaffProfileShowPageController: Object.assign(StaffProfileShowPageController, StaffProfileShowPageController),
    StaffProfileEditPageController: Object.assign(StaffProfileEditPageController, StaffProfileEditPageController),
    StoreStaffProfileController: Object.assign(StoreStaffProfileController, StoreStaffProfileController),
    UpdateStaffProfileController: Object.assign(UpdateStaffProfileController, UpdateStaffProfileController),
    DeleteStaffProfileController: Object.assign(DeleteStaffProfileController, DeleteStaffProfileController),
    UnitsIndexController: Object.assign(UnitsIndexController, UnitsIndexController),
    ReorderUnitsController: Object.assign(ReorderUnitsController, ReorderUnitsController),
    UnitCreatePageController: Object.assign(UnitCreatePageController, UnitCreatePageController),
    UnitShowPageController: Object.assign(UnitShowPageController, UnitShowPageController),
    UnitEditPageController: Object.assign(UnitEditPageController, UnitEditPageController),
    StoreUnitController: Object.assign(StoreUnitController, StoreUnitController),
    UpdateUnitController: Object.assign(UpdateUnitController, UpdateUnitController),
    DeleteUnitController: Object.assign(DeleteUnitController, DeleteUnitController),
    PositionsIndexController: Object.assign(PositionsIndexController, PositionsIndexController),
    StorePositionController: Object.assign(StorePositionController, StorePositionController),
    UpdatePositionController: Object.assign(UpdatePositionController, UpdatePositionController),
    DeletePositionController: Object.assign(DeletePositionController, DeletePositionController),
    UsersIndexController: Object.assign(UsersIndexController, UsersIndexController),
    UserCreatePageController: Object.assign(UserCreatePageController, UserCreatePageController),
    StoreUserController: Object.assign(StoreUserController, StoreUserController),
    UserEditPageController: Object.assign(UserEditPageController, UserEditPageController),
    UpdateUserController: Object.assign(UpdateUserController, UpdateUserController),
    RolesPermissionsIndexController: Object.assign(RolesPermissionsIndexController, RolesPermissionsIndexController),
    StoreRoleController: Object.assign(StoreRoleController, StoreRoleController),
    UpdateRoleController: Object.assign(UpdateRoleController, UpdateRoleController),
    DeleteRoleController: Object.assign(DeleteRoleController, DeleteRoleController),
}

export default Cms