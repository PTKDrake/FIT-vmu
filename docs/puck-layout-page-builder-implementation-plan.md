# Plan triển khai Content Layout + Site Layout Builder bằng Puck

> Mục tiêu: triển khai lại đầy đủ phần `content-layout-strategy.md` cho Page Body Builder, đồng thời mở rộng CMS để quản lý Header/Footer và các layout dùng chung bằng Puck.

## 1. Bối cảnh và định hướng

Hiện tại dự án đã có định hướng dùng Puck cho Page Builder, nhưng phần `content-layout-strategy.md` chưa được triển khai thực tế. Phần đó nên được hiểu là nền tảng cho **body content layout**, tức vùng nội dung riêng của từng page.

Bổ sung mới cần làm là tạo thêm một tầng **Site Layout Builder**, dùng Puck để quản lý các phần dùng chung như header, footer, top bar, sidebar, before main, after main và floating area.

Định hướng tổng thể:

```txt
Page Body Builder = quản lý nội dung riêng của từng page
Site Layout Builder = quản lý khung render dùng chung toàn site
Navigation Manager = quản lý menu dạng dữ liệu riêng, không hard-code toàn bộ trong Puck
```

Không nên trộn header/footer vào `bodyData` của từng page. Page chỉ nên chọn layout, còn layout sẽ tự chứa header/footer và các vùng dùng chung.

---

## 2. Kiến trúc dữ liệu đề xuất

### 2.1. Page

```ts
type Page = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  layoutId: string | null
  bodyData: PuckData
  seo?: PageSeo
  createdAt: string
  updatedAt: string
}
```

`bodyData` chỉ chứa nội dung riêng của page.

Ví dụ:

```txt
Trang giới thiệu khoa
Trang tuyển sinh
Trang liên hệ
Trang tin tức
```

### 2.2. Site Layout

```ts
type SiteLayout = {
  id: string
  name: string
  key: string
  description?: string
  status: 'draft' | 'published'
  isDefault: boolean

  topBarData?: PuckData | null
  headerData?: PuckData | null
  beforeMainData?: PuckData | null
  sidebarData?: PuckData | null
  afterMainData?: PuckData | null
  footerData?: PuckData | null
  floatingData?: PuckData | null

  primaryMenuId?: string | null
  footerMenuId?: string | null
  mobileMenuId?: string | null

  settings: LayoutSettings

  createdAt: string
  updatedAt: string
}
```

### 2.3. Layout Settings

```ts
type LayoutSettings = {
  theme?: 'default' | 'light' | 'dark' | 'brand'
  mainWidth?: 'container' | 'wide' | 'full'
  mainPaddingY?: 'none' | 'sm' | 'md' | 'lg'
  mainBackground?: 'default' | 'muted' | 'dark'

  topBarEnabled?: boolean
  headerEnabled?: boolean
  beforeMainEnabled?: boolean
  sidebarEnabled?: boolean
  afterMainEnabled?: boolean
  footerEnabled?: boolean
  floatingEnabled?: boolean

  breadcrumbEnabled?: boolean

  headerMode?: 'normal' | 'sticky' | 'fixed' | 'transparent'
  headerWidth?: 'container' | 'full'

  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: 'sm' | 'md' | 'lg'
}
```

### 2.4. Navigation Menu

Menu nên là entity riêng, không nên lưu cứng toàn bộ trong Puck.

```ts
type NavigationMenu = {
  id: string
  name: string
  key: string
  items: NavigationItem[]
  createdAt: string
  updatedAt: string
}

type NavigationItem = {
  id: string
  label: string
  href: string
  target?: '_self' | '_blank'
  children?: NavigationItem[]
}
```

Trong Puck header/footer chỉ nên có component chọn menu:

```ts
type NavigationMenuBlockProps = {
  menuId: string
  variant: 'horizontal' | 'vertical' | 'dropdown' | 'mega'
  align?: 'left' | 'center' | 'right'
}
```

---

## 3. Cấu trúc thư mục đề xuất

```txt
src/
  features/
    page-builder/
      configs/
        page.config.ts
        header.config.ts
        footer.config.ts
        layout-slot.config.ts
      components/
        base-layout/
          Section.tsx
          Container.tsx
          TwoColumns.tsx
          Spacer.tsx
          Divider.tsx
          Grid.tsx
          Flex.tsx
        header/
          HeaderBar.tsx
          Logo.tsx
          SiteName.tsx
          NavigationMenuBlock.tsx
          SearchButton.tsx
          LanguageSwitcher.tsx
          HeaderCTA.tsx
          MobileMenuToggle.tsx
        footer/
          FooterSection.tsx
          FooterColumn.tsx
          FooterMenu.tsx
          FooterContact.tsx
          SocialLinks.tsx
          Copyright.tsx
        layout-slots/
          BreadcrumbBlock.tsx
          PageTitleBlock.tsx
          AlertBar.tsx
          CTASection.tsx
          RelatedLinks.tsx
          NewsletterBlock.tsx
          ContactBox.tsx
          FloatingContact.tsx
      render/
        RenderPageBody.tsx
        RenderSiteLayout.tsx
        PublicPageRenderer.tsx
      types/
        puck-data.ts
        page.ts
        site-layout.ts
        navigation.ts
  app/
    cms/
      pages/
      layouts/
      navigation/
```

Nếu dự án đang dùng cấu trúc khác thì không cần đổi toàn bộ, nhưng nên giữ tư duy tách rõ:

```txt
configs riêng
components riêng
render riêng
types riêng
```

---

## 4. Phase 1: Triển khai nền tảng Content Layout Strategy

Phase này triển khai phần đã có trong `content-layout-strategy.md`. Đây là nền móng để page body, header, footer và layout slots có thể reuse cùng một bộ layout primitive.

### 4.1. Tạo nhóm base layout components

Cần triển khai 7 component nền tảng:

```txt
Section
Container
TwoColumns
Spacer
Divider
Grid
Flex
```

Các component này phải hỗ trợ:

```txt
children slot cho Puck
className tùy chỉnh
responsive cơ bản
style đồng bộ với design system hiện tại
label tiếng Việt ngắn gọn trong CMS
```

### 4.2. Section

Dùng để tạo vùng lớn theo chiều ngang.

Props:

```ts
type SectionProps = {
  background: 'transparent' | 'primary-subtle' | 'info-subtle' | 'dark'
  paddingY: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}
```

Field trong Puck:

```txt
background: Màu nền
paddingY: Khoảng cách dọc
className: Lớp CSS bổ sung
children: Nội dung
```

Yêu cầu:

```txt
Có thể bọc nhiều block nội dung bên trong
Không tự giới hạn max-width
Thường dùng kết hợp với Container
```

### 4.3. Container

Dùng để giới hạn độ rộng nội dung.

Props:

```ts
type ContainerProps = {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  paddingX: 'default' | 'none'
  className?: string
  children?: React.ReactNode
}
```

Mapping đề xuất:

```txt
sm = 768px
md = 1024px
lg = 1280px
xl = 1440px
full = 100%
```

### 4.4. TwoColumns

Dùng để chia nội dung thành hai cột.

Props:

```ts
type TwoColumnsProps = {
  columnRatio: 'equal' | 'left-wide' | 'right-wide'
  gap: number
  className?: string
  left?: React.ReactNode
  right?: React.ReactNode
}
```

Yêu cầu responsive:

```txt
Desktop: hiển thị 2 cột
Mobile: stack thành 1 cột
```

### 4.5. Spacer

Dùng để tạo khoảng trống dọc.

Props:

```ts
type SpacerProps = {
  height: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}
```

Mapping đề xuất:

```txt
xs = 12px
sm = 24px
md = 48px
lg = 80px
xl = 120px
```

### 4.6. Divider

Dùng để tạo đường phân cách.

Props:

```ts
type DividerProps = {
  type: 'solid' | 'dashed' | 'dotted'
  color: 'default' | 'primary' | 'muted'
  className?: string
}
```

### 4.7. Grid

Dùng để chia layout dạng lưới.

Props:

```ts
type GridProps = {
  columns: number
  gap: number
  className?: string
  children?: React.ReactNode
}
```

Yêu cầu responsive:

```txt
Mobile: tự giảm về 1 cột
Tablet: tối đa 2 cột nếu columns lớn hơn 2
Desktop: dùng đúng columns đã cấu hình
```

### 4.8. Flex

Dùng để tạo layout linh hoạt.

Props:

```ts
type FlexProps = {
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems: 'start' | 'center' | 'end' | 'stretch'
  gap: number
  className?: string
  children?: React.ReactNode
}
```

### 4.9. Tiêu chí hoàn thành Phase 1

```txt
[ ] Có đủ 7 base layout components
[ ] Có Puck config cho từng component
[ ] Kéo thả được children/slot trong Puck
[ ] Render đúng ở public page
[ ] Responsive cơ bản không vỡ layout
[ ] Có preview trong CMS
[ ] Có fallback khi PuckData rỗng hoặc lỗi
```

---

## 5. Phase 2: Triển khai Page Body Builder

Phase này dùng base layout components để build nội dung từng page.

### 5.1. Tạo `page.config.ts`

`page.config.ts` là config chính cho body content.

Nên include:

```txt
Base layout components:
- Section
- Container
- TwoColumns
- Spacer
- Divider
- Grid
- Flex

Content components:
- Heading
- Text
- RichText
- Image
- Button
- Card
- Gallery
- VideoEmbed
- ContactFormBlock
- MapEmbed
- FAQBlock
```

Không nên include component chỉ dành cho header/footer như:

```txt
HeaderBar
FooterColumn
MobileMenuToggle
Copyright
```

### 5.2. Page CRUD trong CMS

Trang CMS `Pages` cần có:

```txt
Danh sách page
Tạo page
Sửa page metadata
Sửa body bằng Puck
Chọn layout
Preview
Publish/Draft
```

Field tối thiểu:

```txt
Title
Slug
Status
Layout
SEO title
SEO description
Body Builder
```

### 5.3. Render Page Body

```tsx
export function RenderPageBody({ data }: { data: PuckData }) {
  return <Render config={pageConfig} data={data} />
}
```

### 5.4. Tiêu chí hoàn thành Phase 2

```txt
[ ] Tạo/sửa được page
[ ] Page lưu được bodyData
[ ] Page chọn được layoutId
[ ] Public route render đúng bodyData
[ ] Draft page không public nếu chưa publish
[ ] Preview page hoạt động trong CMS
```

---

## 6. Phase 3: Triển khai Site Layout Builder

Phase này tạo trang quản lý layout riêng trong CMS.

### 6.1. Layout zones

Một layout nên hỗ trợ các vùng:

```txt
TopBar
Header
BeforeMain
Main
Sidebar
AfterMain
Footer
FloatingArea
```

Trong đó MVP chỉ cần làm trước:

```txt
Header
Main wrapper
Footer
```

Sau đó mở rộng dần:

```txt
TopBar
BeforeMain
Sidebar
AfterMain
FloatingArea
```

### 6.2. Trang CMS `Layouts`

Cấu trúc UI:

```txt
Layouts
├─ Danh sách layout
├─ Tạo layout từ preset
└─ Edit layout
   ├─ General
   ├─ Header
   ├─ Footer
   ├─ Preview
   └─ Advanced
```

Giai đoạn sau mở rộng thêm:

```txt
Top Bar
Before Main
Sidebar
After Main
Floating
```

### 6.3. Tab General

Field cần có:

```txt
Tên layout
Key
Mô tả
Trạng thái draft/published
Đặt làm mặc định
Menu chính
Menu footer
Menu mobile
Header mode
Main width
Main padding Y
Footer enabled
```

### 6.4. Layout presets

Nên tạo sẵn các preset:

```txt
Default Layout
Landing Layout
Sidebar Layout
Minimal Layout
Blank Layout
News Layout
```

#### Default Layout

```txt
TopBar optional
Header normal/sticky
Main container
Footer multi-column
```

#### Landing Layout

```txt
Header sticky hoặc transparent
Main full width
AfterMain CTA
Footer
```

#### Sidebar Layout

```txt
Header
Breadcrumb/Page title
Main + Sidebar
Footer
```

#### Minimal Layout

```txt
Main only
Footer simple optional
Không topbar
Không sidebar
```

#### Blank Layout

```txt
Chỉ render body
Không header
Không footer
```

#### News Layout

```txt
Header
Breadcrumb
Article title area
Main article + right sidebar
Related posts
Footer
```

### 6.5. Tiêu chí hoàn thành Phase 3

```txt
[ ] Có model/entity SiteLayout
[ ] Có trang danh sách layout
[ ] Tạo/sửa/xóa layout được
[ ] Set default layout được
[ ] Page chọn layout được
[ ] Public render theo layout được
[ ] Không có layout thì fallback về default layout
```

---

## 7. Phase 4: Header Builder bằng Puck

### 7.1. Tạo `header.config.ts`

Header config nên giới hạn component, không dùng toàn bộ page components.

Components nên có:

```txt
HeaderBar
Logo
SiteName
NavigationMenuBlock
SearchButton
LanguageSwitcher
HeaderCTA
MobileMenuToggle
Container
Flex
Grid
Divider
```

Không nên cho các component body quá nặng vào header:

```txt
Hero
Gallery
FAQ
Long RichText
MapEmbed
```

### 7.2. HeaderBar

Props đề xuất:

```ts
type HeaderBarProps = {
  sticky?: boolean
  transparent?: boolean
  height?: 'compact' | 'normal' | 'large'
  width?: 'container' | 'full'
  borderBottom?: boolean
  shadow?: boolean
  className?: string
  children?: React.ReactNode
}
```

### 7.3. Logo

Props:

```ts
type LogoProps = {
  imageUrl?: string
  alt?: string
  href?: string
  width?: number
  height?: number
  showText?: boolean
  text?: string
}
```

### 7.4. NavigationMenuBlock

Props:

```ts
type NavigationMenuBlockProps = {
  menuId: string
  variant: 'horizontal' | 'vertical' | 'dropdown' | 'mega'
  align?: 'left' | 'center' | 'right'
  showActiveState?: boolean
}
```

### 7.5. Mobile behavior

Header cần xử lý responsive riêng:

```txt
Desktop: hiện menu ngang
Mobile: ẩn menu, hiện MobileMenuToggle
Mobile menu: drawer/dropdown
```

Có thể để phase sau nếu MVP cần nhanh.

### 7.6. Tiêu chí hoàn thành Phase 4

```txt
[ ] Có header.config.ts
[ ] Layout lưu được headerData
[ ] CMS edit header bằng Puck được
[ ] Public render header đúng
[ ] Header responsive cơ bản
[ ] Header không bị phụ thuộc vào bodyData
```

---

## 8. Phase 5: Footer Builder bằng Puck

### 8.1. Tạo `footer.config.ts`

Components nên có:

```txt
FooterSection
FooterColumn
FooterMenu
FooterContact
SocialLinks
Copyright
Logo
Container
Grid
Flex
Divider
```

### 8.2. FooterSection

Props:

```ts
type FooterSectionProps = {
  variant?: 'simple' | 'multi-column' | 'large'
  background?: 'default' | 'muted' | 'dark' | 'brand'
  width?: 'container' | 'full'
  paddingY?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}
```

### 8.3. FooterColumn

Props:

```ts
type FooterColumnProps = {
  title?: string
  className?: string
  children?: React.ReactNode
}
```

### 8.4. FooterMenu

Props:

```ts
type FooterMenuProps = {
  menuId: string
  direction?: 'vertical' | 'horizontal'
}
```

### 8.5. Tiêu chí hoàn thành Phase 5

```txt
[ ] Có footer.config.ts
[ ] Layout lưu được footerData
[ ] CMS edit footer bằng Puck được
[ ] Public render footer đúng
[ ] Footer responsive cơ bản
[ ] Footer có thể tắt/bật theo layout
```

---

## 9. Phase 6: Navigation Manager

### 9.1. Tạo trang CMS `Navigation`

UI cần có:

```txt
Danh sách menu
Tạo menu
Sửa menu
Sắp xếp item bằng drag/drop
Nested menu items
Preview menu
```

Field cho menu item:

```txt
Label
Href
Target
Parent item
Order
```

### 9.2. Tích hợp với Header/Footer

Header/Footer không tự nhập từng link thủ công, mà chọn `menuId`.

Ví dụ:

```txt
Header NavigationMenuBlock -> chọn Main Menu
Footer FooterMenu -> chọn Footer Menu
Mobile menu -> chọn Mobile Menu hoặc dùng Main Menu
```

### 9.3. Tiêu chí hoàn thành Phase 6

```txt
[ ] CRUD được menu
[ ] CRUD được menu item
[ ] Reorder được item
[ ] Header/Footer chọn được menu
[ ] Render menu active state theo current path
```

---

## 10. Phase 7: Layout Slots mở rộng

Sau khi MVP ổn, mở rộng các vùng dùng chung.

### 10.1. TopBar

Dùng cho:

```txt
Thông báo tuyển sinh
Hotline
Email
Social links
Language switcher
Login link
```

Config nên dùng:

```txt
AlertBar
Text
Link
SocialLinks
LanguageSwitcher
Container
Flex
```

### 10.2. BeforeMain

Dùng cho:

```txt
Breadcrumb
PageTitle
Alert toàn site
Banner nhỏ
```

Components:

```txt
BreadcrumbBlock
PageTitleBlock
AlertBar
Section
Container
Flex
Divider
```

### 10.3. Sidebar

Dùng cho:

```txt
Danh mục tin tức
Menu con
Bài viết mới
Liên hệ nhanh
Table of contents
```

Components:

```txt
SidebarMenu
CategoryList
RecentPosts
ContactBox
RelatedLinks
TableOfContents
```

### 10.4. AfterMain

Dùng cho:

```txt
CTA chung
Newsletter
Related pages
Contact form ngắn
Partner logos
```

Components:

```txt
CTASection
NewsletterBlock
RelatedLinks
ContactBox
LogoStrip
Section
Container
Grid
```

### 10.5. FloatingArea

Dùng cho:

```txt
Back to top
Hotline floating
Zalo/Facebook contact
Chat widget
Cookie banner
```

Components:

```txt
FloatingContact
BackToTop
CookieBanner
```

---

## 11. Public rendering flow

Render public page nên đi theo flow:

```tsx
export function PublicPageRenderer({ page, layout }: Props) {
  return (
    <>
      {layout.settings.topBarEnabled && layout.topBarData && (
        <Render config={layoutSlotConfig} data={layout.topBarData} />
      )}

      {layout.settings.headerEnabled && layout.headerData && (
        <Render config={headerConfig} data={layout.headerData} />
      )}

      {layout.settings.beforeMainEnabled && layout.beforeMainData && (
        <Render config={layoutSlotConfig} data={layout.beforeMainData} />
      )}

      <MainShell settings={layout.settings}>
        {layout.settings.sidebarEnabled && layout.sidebarData && (
          <aside>
            <Render config={layoutSlotConfig} data={layout.sidebarData} />
          </aside>
        )}

        <main>
          <Render config={pageConfig} data={page.bodyData} />
        </main>
      </MainShell>

      {layout.settings.afterMainEnabled && layout.afterMainData && (
        <Render config={layoutSlotConfig} data={layout.afterMainData} />
      )}

      {layout.settings.footerEnabled && layout.footerData && (
        <Render config={footerConfig} data={layout.footerData} />
      )}

      {layout.settings.floatingEnabled && layout.floatingData && (
        <Render config={layoutSlotConfig} data={layout.floatingData} />
      )}
    </>
  )
}
```

MVP có thể đơn giản hơn:

```tsx
export function PublicPageRenderer({ page, layout }: Props) {
  return (
    <>
      <Render config={headerConfig} data={layout.headerData} />
      <main>
        <Render config={pageConfig} data={page.bodyData} />
      </main>
      <Render config={footerConfig} data={layout.footerData} />
    </>
  )
}
```

---

## 12. API/Service layer đề xuất

Tùy stack hiện tại, có thể dùng REST, server actions hoặc repository/service nội bộ. Về mặt nghiệp vụ nên có các action sau.

### 12.1. Page

```txt
GET    /cms/pages
POST   /cms/pages
GET    /cms/pages/:id
PUT    /cms/pages/:id
DELETE /cms/pages/:id
POST   /cms/pages/:id/publish
POST   /cms/pages/:id/duplicate
```

### 12.2. Layout

```txt
GET    /cms/layouts
POST   /cms/layouts
GET    /cms/layouts/:id
PUT    /cms/layouts/:id
DELETE /cms/layouts/:id
POST   /cms/layouts/:id/publish
POST   /cms/layouts/:id/set-default
POST   /cms/layouts/:id/duplicate
```

### 12.3. Navigation

```txt
GET    /cms/navigation
POST   /cms/navigation
GET    /cms/navigation/:id
PUT    /cms/navigation/:id
DELETE /cms/navigation/:id
PUT    /cms/navigation/:id/items/reorder
```

---

## 13. Validation và fallback

### 13.1. Layout fallback

Khi page không có `layoutId`:

```txt
Dùng layout mặc định đã published
Nếu không có layout mặc định thì dùng Blank Layout runtime fallback
```

### 13.2. Puck data fallback

Khi `headerData`, `footerData`, `bodyData` rỗng hoặc lỗi:

```txt
Không crash public page
Log lỗi trong dev
Hiển thị fallback an toàn trong CMS preview
```

### 13.3. Publish validation

Trước khi publish layout:

```txt
Key không trùng
Nếu set default thì chỉ có một default layout
headerData/footerData hợp lệ nếu đang bật
Menu được chọn phải tồn tại
```

Trước khi publish page:

```txt
Slug không trùng
layoutId tồn tại hoặc có default layout
bodyData hợp lệ
SEO optional nhưng không được lỗi schema
```

---

## 14. Responsive strategy

Các base layout components phải xử lý responsive mặc định, tránh bắt admin tự thêm quá nhiều class.

Quy tắc:

```txt
TwoColumns: mobile stack 1 cột
Grid: mobile 1 cột, tablet tối đa 2 cột, desktop theo config
Container: luôn có padding ngang mặc định nếu paddingX = default
Header: mobile chuyển sang menu toggle
Footer: grid/footer columns stack trên mobile
Sidebar: mobile đưa xuống dưới main hoặc ẩn tùy settings
```

Có thể thêm field nâng cao sau:

```ts
type ResponsiveVisibility = {
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
}
```

Nhưng MVP chưa cần làm nếu muốn nhanh.

---

## 15. Phân quyền CMS

Nếu CMS có role/permission, nên tách quyền:

```txt
pages.view
pages.create
pages.update
pages.publish
pages.delete

layouts.view
layouts.create
layouts.update
layouts.publish
layouts.delete
layouts.setDefault

navigation.view
navigation.create
navigation.update
navigation.delete
```

Nếu chưa có permission system, MVP có thể chỉ cần admin mới vào được toàn bộ.

---

## 16. Checklist triển khai theo thứ tự ưu tiên

### Sprint 1: Base layout + Page body

```txt
[ ] Tạo base layout components
[ ] Tạo Puck fields cho Section/Container/TwoColumns/Spacer/Divider/Grid/Flex
[ ] Tạo page.config.ts
[ ] Tạo RenderPageBody
[ ] Tạo/sửa page bodyData trong CMS
[ ] Public render page body
```

### Sprint 2: Layout entity + Header/Footer MVP

```txt
[ ] Tạo SiteLayout type/model
[ ] Tạo layout CRUD trong CMS
[ ] Tạo header.config.ts
[ ] Tạo footer.config.ts
[ ] Tạo HeaderBar, Logo, NavigationMenuBlock cơ bản
[ ] Tạo FooterSection, FooterColumn, Copyright cơ bản
[ ] Page chọn layoutId
[ ] Public render Header + Body + Footer
```

### Sprint 3: Navigation Manager

```txt
[ ] Tạo NavigationMenu model
[ ] Tạo NavigationItem model
[ ] Tạo CMS Navigation page
[ ] Header/Footer chọn menuId
[ ] Render active state
[ ] Responsive menu mobile cơ bản
```

### Sprint 4: Layout slots mở rộng

```txt
[ ] TopBar slot
[ ] BeforeMain slot
[ ] Sidebar slot
[ ] AfterMain slot
[ ] FloatingArea slot
[ ] layout-slot.config.ts
[ ] Settings bật/tắt từng vùng
```

### Sprint 5: Preset, preview, polish

```txt
[ ] Layout presets
[ ] Duplicate layout
[ ] Preview layout với page mẫu
[ ] Publish validation
[ ] Empty state đẹp
[ ] Error boundary cho render Puck
[ ] Responsive polish
```

---

## 17. Định nghĩa hoàn thành tổng thể

Tính năng được coi là xong khi:

```txt
[ ] Admin tạo page và build body bằng Puck được
[ ] Admin tạo layout riêng được
[ ] Admin build header/footer bằng Puck được
[ ] Page chọn layout được
[ ] Public page render theo đúng Header + Body + Footer
[ ] Có default layout fallback
[ ] Menu được quản lý riêng và dùng lại trong header/footer
[ ] Layout components responsive ổn
[ ] Draft/published hoạt động rõ ràng
[ ] Không làm vỡ các page hiện tại
```

---

## 18. MVP scope khuyến nghị

Nếu cần làm nhanh, chỉ làm MVP này trước:

```txt
1. Base layout components:
   - Section
   - Container
   - TwoColumns
   - Spacer
   - Divider
   - Grid
   - Flex

2. Page Body Builder:
   - page.config.ts
   - bodyData
   - page chọn layoutId

3. Layout Builder:
   - Layout entity
   - headerData
   - footerData
   - settings cơ bản

4. Header/Footer Builder:
   - header.config.ts
   - footer.config.ts
   - Render Header + Body + Footer

5. Default layout fallback
```

Chưa cần làm ngay:

```txt
TopBar
Sidebar
BeforeMain
AfterMain
FloatingArea
Layout preset phức tạp
Nested mega menu
Advanced responsive visibility
```

---

## 19. Prompt triển khai gợi ý cho AI/code agent

```txt
Triển khai tính năng Content Layout + Site Layout Builder bằng Puck cho CMS.

Yêu cầu:
1. Implement 7 base layout components cho Puck: Section, Container, TwoColumns, Spacer, Divider, Grid, Flex. Mỗi component cần support className và slot/children theo đúng khả năng của Puck.
2. Tạo page.config.ts dùng cho Page Body Builder. Page body chỉ quản lý nội dung riêng của page, lưu vào bodyData.
3. Tạo SiteLayout model/type gồm headerData, footerData, settings, isDefault, status. Page phải có layoutId để chọn layout.
4. Tạo header.config.ts và footer.config.ts riêng, không dùng chung toàn bộ page.config.ts.
5. Header config gồm HeaderBar, Logo, NavigationMenuBlock, SearchButton, LanguageSwitcher, HeaderCTA, Container, Flex, Grid, Divider.
6. Footer config gồm FooterSection, FooterColumn, FooterMenu, FooterContact, SocialLinks, Copyright, Logo, Container, Grid, Flex, Divider.
7. Tạo PublicPageRenderer render theo thứ tự Header + Main Body + Footer.
8. Nếu page không có layoutId, dùng default published layout. Nếu không có default layout, dùng fallback blank layout để không crash.
9. Tạo CMS pages: Pages, Layouts, Navigation ở mức MVP. Layouts phải có tab General, Header, Footer, Preview.
10. Menu nên là entity riêng NavigationMenu/NavigationItem. Header/Footer chỉ chọn menuId.
11. Đảm bảo responsive cơ bản: TwoColumns stack mobile, Grid giảm cột mobile, Footer stack mobile, Header có mobile menu cơ bản hoặc fallback an toàn.
12. Không làm vỡ flow Page Builder hiện tại. Tách rõ bodyData của Page và headerData/footerData của Layout.
```

---

## 20. Ghi chú thiết kế quan trọng

Không nên dùng một Puck config duy nhất cho tất cả vùng.

Nên tách:

```txt
page.config.ts       = dành cho body content
header.config.ts     = dành cho header
footer.config.ts     = dành cho footer
layout-slot.config.ts = dành cho topBar/sidebar/beforeMain/afterMain/floating
```

Lý do:

```txt
Header cần component ngắn, điều hướng, logo, CTA
Footer cần column, contact, social, copyright
Body cần content block phong phú
Layout slot cần block tiện ích như breadcrumb, alert, CTA
```

Cách này giúp CMS dễ dùng hơn, tránh admin kéo nhầm block không phù hợp vào header/footer.
