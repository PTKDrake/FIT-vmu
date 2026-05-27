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
}

export default Cms