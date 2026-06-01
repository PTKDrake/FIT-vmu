import { useState, type ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import { AppLogo } from "@/components/brand/app-logo";
import { cn } from "@/lib/utils";
import type { SharedData } from "@/types/shared";

export interface NavigationItem {
  id: number;
  menuId: number;
  title: string;
  type: string;
  target: string;
  sortOrder: number;
  isActive: boolean;
  parentId: number | null;
  linkableType: string | null;
  linkableId: number | null;
  url: string | null;
  slug?: string; // resolved slug
  children?: NavigationItem[];
}

interface PublicShellProps {
  children: ReactNode;
  headerMenu?: NavigationItem[];
  footerMenu?: NavigationItem[];
  announcement?: string;
}

export function getNavigationUrl(item: NavigationItem): string {
  if (item.type === "custom_url") {
    return item.url || "#";
  }
  
  const slug = item.slug || String(item.linkableId);
  switch (item.type) {
    case "page":
      return `/pages/${slug}`;
    case "post":
      return `/posts/${slug}`;
    case "post_category":
      return `/categories/${slug}`;
    default:
      return "#";
  }
}

export default function PublicShell({
  children,
  headerMenu = [],
  footerMenu = [],
  announcement,
}: PublicShellProps) {
  const { auth } = usePage<SharedData>().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const canAccessAdmin = auth.user && auth.permissions.includes("view admin dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg font-sans antialiased selection:bg-primary/20 selection:text-primary">
      {/* Announcement Bar */}
      {announcement && (
        <div className="relative bg-gradient-to-r from-primary/90 to-accent/90 text-primary-fg px-4 py-2 text-center text-xs font-medium tracking-wide shadow-sm animate-fade-in">
          <p>{announcement}</p>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-bg/75 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
            <AppLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {headerMenu.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const url = getNavigationUrl(item);

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  {hasChildren ? (
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-fg rounded-lg transition-colors hover:text-fg hover:bg-muted/50",
                        activeDropdown === item.id && "text-fg bg-muted/80"
                      )}
                    >
                      {item.title}
                      <svg
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          activeDropdown === item.id && "transform rotate-180"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={url}
                      className="block px-4 py-2 text-sm font-medium text-muted-fg rounded-lg transition-colors hover:text-fg hover:bg-muted/50"
                    >
                      {item.title}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {hasChildren && activeDropdown === item.id && (
                    <div className="absolute left-0 mt-1 w-56 rounded-xl border border-border/50 bg-overlay p-2 shadow-xl ring-1 ring-black/5 animate-slide-up">
                      <div className="space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={getNavigationUrl(child)}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-colors hover:bg-muted/50 hover:text-fg"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {auth.user ? (
              <>
                {canAccessAdmin && (
                  <Link
                    href="/cms"
                    className="px-4 py-2 text-sm font-medium text-muted-fg rounded-lg transition-all hover:text-fg hover:bg-muted/50"
                  >
                    CMS Dashboard
                  </Link>
                )}
                <Link
                  href="/settings/profile"
                  className="px-4 py-2 text-sm font-medium text-muted-fg rounded-lg transition-all hover:text-fg hover:bg-muted/50"
                >
                  Cài đặt
                </Link>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="px-4 py-2 text-sm font-semibold text-primary-fg bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm shadow-primary/20 hover:shadow-md"
                >
                  Đăng xuất
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-fg hover:text-fg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-primary-fg bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm shadow-primary/20 hover:shadow-md"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {auth.user && canAccessAdmin && (
              <Link
                href="/cms"
                className="p-2 text-muted-fg hover:text-fg rounded-lg transition-colors"
                title="CMS"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-fg hover:text-fg rounded-lg transition-colors focus:outline-hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-overlay px-4 py-4 space-y-3 animate-fade-in">
            <div className="space-y-1">
              {headerMenu.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="px-3 py-2 text-sm font-semibold text-fg">
                      {item.title}
                    </div>
                    {hasChildren ? (
                      <div className="pl-4 space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={getNavigationUrl(child)}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-fg hover:bg-muted/50 hover:text-fg"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={getNavigationUrl(item)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-fg hover:bg-muted/50 hover:text-fg"
                      >
                        Đi tới {item.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <hr className="border-border/40" />

            <div className="space-y-2">
              {auth.user ? (
                <>
                  <Link
                    href="/settings/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-fg hover:bg-muted/50 hover:text-fg"
                  >
                    Cài đặt hồ sơ
                  </Link>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left block rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted/50"
                  >
                    Đăng xuất
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-fg hover:bg-muted/50 hover:text-fg"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary"
                  >
                    Đăng ký tài khoản
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Site Footer */}
      <footer className="border-t border-border/40 bg-overlay/50 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <AppLogo size="sm" />
              <p className="text-sm text-muted-fg max-w-xs">
                Hệ thống quản lý thông tin đào tạo và nghiên cứu khoa học VMUFit.
              </p>
            </div>
            
            {footerMenu.map((item) => (
              <div key={item.id} className="space-y-3">
                <h4 className="text-sm font-semibold text-fg tracking-wider uppercase">
                  {item.title}
                </h4>
                {item.children && item.children.length > 0 && (
                  <ul className="space-y-2 text-sm">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={getNavigationUrl(child)}
                          className="text-muted-fg hover:text-fg transition-colors"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-fg">
            <p>&copy; {new Date().getFullYear()} VMUFit. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-fg">Chính sách bảo mật</Link>
              <Link href="/terms" className="hover:text-fg">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
