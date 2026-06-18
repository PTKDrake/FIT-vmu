import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { Link, type LinkProps } from "@/components/ui/link";
import { cx } from "@/lib/primitive";

interface NavbarMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavbarGroupContextProps {
  activeMenuId: string | null;
  close: () => void;
  requestClose: () => void;
  requestOpen: (menuId: string, immediate?: boolean) => void;
}

const NavbarMenuContext = createContext<NavbarMenuContextProps | null>(null);
const NavbarGroupContext = createContext<NavbarGroupContextProps | null>(null);

const useNavbarMenu = () => {
  const context = useContext(NavbarMenuContext);

  if (!context) {
    throw new Error("useNavbarMenu must be used within a NavbarMenu.");
  }

  return context;
};

interface NavbarGroupProps extends React.ComponentProps<"div"> {
  delayCloseMs?: number;
  delayOpenMs?: number;
}

const NavbarGroup = ({
  children,
  className,
  delayCloseMs = 150,
  delayOpenMs = 80,
  onBlurCapture,
  onFocusCapture,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  ...props
}: NavbarGroupProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useMountEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  });

  const close = () => {
    clearOpenTimer();
    clearCloseTimer();
    setActiveMenuId(null);
  };

  const requestOpen = (menuId: string, immediate = false) => {
    clearCloseTimer();

    if (immediate || activeMenuId !== null || delayOpenMs <= 0) {
      clearOpenTimer();
      setActiveMenuId(menuId);
      return;
    }

    clearOpenTimer();
    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = null;
      setActiveMenuId(menuId);
    }, delayOpenMs);
  };

  const requestClose = () => {
    clearOpenTimer();

    if (delayCloseMs <= 0) {
      setActiveMenuId(null);
      return;
    }

    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setActiveMenuId(null);
    }, delayCloseMs);
  };

  return (
    <NavbarGroupContext.Provider
      value={{ activeMenuId, close, requestClose, requestOpen }}
    >
      <div
        className={twMerge("min-w-0", className)}
        onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
          onBlurCapture?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (!event.currentTarget.contains(event.relatedTarget)) {
            requestClose();
          }
        }}
        onFocusCapture={(event: FocusEvent<HTMLDivElement>) => {
          onFocusCapture?.(event);
          if (event.defaultPrevented) {
            return;
          }

          clearCloseTimer();
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (event.key === "Escape") {
            close();
          }
        }}
        onMouseEnter={(event: MouseEvent<HTMLDivElement>) => {
          onMouseEnter?.(event);
          if (event.defaultPrevented) {
            return;
          }

          clearCloseTimer();
        }}
        onMouseLeave={(event: MouseEvent<HTMLDivElement>) => {
          onMouseLeave?.(event);
          if (event.defaultPrevented) {
            return;
          }

          requestClose();
        }}
        {...props}
      >
        {children}
      </div>
    </NavbarGroupContext.Provider>
  );
};

interface NavbarMenuProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  delayCloseMs?: number;
  delayOpenMs?: number;
  menuId?: string;
}

const NavbarMenu = ({
  children,
  className,
  defaultOpen = false,
  delayCloseMs = 0,
  delayOpenMs = 0,
  menuId: explicitMenuId,
  onBlurCapture,
  onFocusCapture,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  ...props
}: NavbarMenuProps) => {
  const fallbackMenuId = useId();
  const menuId = explicitMenuId ?? props.id ?? fallbackMenuId;
  const groupContext = useContext(NavbarGroupContext);
  const [open, setOpen] = useState(defaultOpen);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isOpen = groupContext ? groupContext.activeMenuId === menuId : open;
  const setMenuOpen = (nextOpen: boolean) => {
    if (groupContext) {
      if (nextOpen) {
        groupContext.requestOpen(menuId, true);
      } else {
        groupContext.close();
      }

      return;
    }

    setOpen(nextOpen);
  };

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useMountEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  });

  const scheduleOpen = (immediate = false) => {
    clearCloseTimer();
    if (immediate || delayOpenMs <= 0) {
      clearOpenTimer();
      setOpen(true);
      return;
    }
    clearOpenTimer();
    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = null;
      setOpen(true);
    }, delayOpenMs);
  };

  const scheduleClose = () => {
    clearOpenTimer();
    if (delayCloseMs <= 0) {
      setOpen(false);
      return;
    }
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, delayCloseMs);
  };

  const handleOpenState = (nextOpen: boolean, immediate = false) => {
    if (groupContext) {
      if (nextOpen) {
        groupContext.requestOpen(menuId, immediate);
      }

      return;
    }

    if (nextOpen) {
      scheduleOpen(immediate);
    } else {
      scheduleClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape") {
      clearOpenTimer();
      clearCloseTimer();
      if (groupContext) {
        groupContext.close();
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <NavbarMenuContext.Provider value={{ open: isOpen, setOpen: setMenuOpen }}>
      <div
        onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
          onBlurCapture?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (
            !groupContext &&
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            handleOpenState(false);
          }
        }}
        onFocusCapture={(event: FocusEvent<HTMLDivElement>) => {
          onFocusCapture?.(event);
          if (event.defaultPrevented) {
            return;
          }

          handleOpenState(true, true);
        }}
        onKeyDown={handleKeyDown}
        onMouseEnter={(event: MouseEvent<HTMLDivElement>) => {
          onMouseEnter?.(event);
          if (event.defaultPrevented) {
            return;
          }

          handleOpenState(true);
        }}
        onMouseLeave={(event: MouseEvent<HTMLDivElement>) => {
          onMouseLeave?.(event);
          if (event.defaultPrevented) {
            return;
          }

          handleOpenState(false);
        }}
        className={twMerge(
          "relative min-w-0 md:after:pointer-events-none md:after:absolute md:after:left-0 md:after:top-full md:after:z-[200] md:after:h-3 md:after:w-full md:after:content-['']",
          isOpen ? "z-[200] md:after:pointer-events-auto" : "",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </NavbarMenuContext.Provider>
  );
};

interface NavbarItemProps extends LinkProps {
  isCurrent?: boolean;
}

const NavbarItem = ({ className, isCurrent, ...props }: NavbarItemProps) => {
  const menuContext = useContext(NavbarMenuContext);

  return (
    <Link
      data-slot="navbar-item"
      aria-current={isCurrent ? "page" : undefined}
      aria-expanded={menuContext ? menuContext.open : undefined}
      className={cx(
        [
          "href" in props ? "cursor-pointer" : "cursor-default",
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none",
          "hover:bg-secondary hover:text-secondary-fg",
          "pressed:bg-secondary pressed:text-secondary-fg",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          "aria-[current=page]:bg-secondary/50 aria-[current=page]:text-fg aria-[current=page]:hover:bg-secondary",
          "disabled:pointer-events-none disabled:opacity-50",
          "*:[svg:not([class*='size-'])]:size-4 *:[svg:not([class*='text-'])]:text-muted-fg",
        ],
        className,
      )}
      {...props}
    />
  );
};

const NavbarSubmenu = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open } = useNavbarMenu();

  return (
    <div
      aria-hidden={open ? undefined : true}
      data-open={open ? "true" : "false"}
      className={twMerge(
        [
          "invisible mt-0 flex flex-col bg-bg ps-3 opacity-0 transition-[opacity,transform,visibility] duration-150 data-[open=true]:visible data-[open=true]:opacity-100",
          "md:pointer-events-none md:absolute md:left-0 md:top-[calc(100%-0.25rem)] md:z-[210] md:min-w-48 md:translate-y-1 md:overflow-hidden md:rounded-md md:border md:border-border md:bg-overlay md:p-1 md:ps-1 md:pt-2 md:text-fg md:shadow-lg md:ring-1 md:ring-border/60 md:data-[open=true]:pointer-events-auto md:data-[open=true]:translate-y-0",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type { NavbarItemProps };
export { NavbarGroup, NavbarItem, NavbarMenu, NavbarSubmenu };
