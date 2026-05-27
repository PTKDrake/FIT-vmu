import PostsIndexController from './PostsIndexController'
import PagesIndexController from './PagesIndexController'
import StorePageController from './StorePageController'
import PageEditorController from './PageEditorController'
import UpdatePageMetadataController from './UpdatePageMetadataController'
import UpdatePageContentController from './UpdatePageContentController'
import ClonePageController from './ClonePageController'
import DeletePageController from './DeletePageController'
import MediaIndexController from './MediaIndexController'
import StoreMediaController from './StoreMediaController'
import RenameMediaController from './RenameMediaController'
import DuplicateMediaController from './DuplicateMediaController'
import DeleteMediaController from './DeleteMediaController'
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

const Cms = {
    PostsIndexController: Object.assign(PostsIndexController, PostsIndexController),
    PagesIndexController: Object.assign(PagesIndexController, PagesIndexController),
    StorePageController: Object.assign(StorePageController, StorePageController),
    PageEditorController: Object.assign(PageEditorController, PageEditorController),
    UpdatePageMetadataController: Object.assign(UpdatePageMetadataController, UpdatePageMetadataController),
    UpdatePageContentController: Object.assign(UpdatePageContentController, UpdatePageContentController),
    ClonePageController: Object.assign(ClonePageController, ClonePageController),
    DeletePageController: Object.assign(DeletePageController, DeletePageController),
    MediaIndexController: Object.assign(MediaIndexController, MediaIndexController),
    StoreMediaController: Object.assign(StoreMediaController, StoreMediaController),
    RenameMediaController: Object.assign(RenameMediaController, RenameMediaController),
    DuplicateMediaController: Object.assign(DuplicateMediaController, DuplicateMediaController),
    DeleteMediaController: Object.assign(DeleteMediaController, DeleteMediaController),
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
}

export default Cms