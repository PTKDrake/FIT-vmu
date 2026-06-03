import { mergeProps } from "react-aria";
import { useHover } from "react-aria/useHover";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import { Link, type LinkProps } from "@/components/ui/link";
import { cx } from "@/lib/primitive";

interface NavbarMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NavbarMenuContext = createContext<NavbarMenuContextProps | null>(null);

const useNavbarMenu = () => {
  const context = useContext(NavbarMenuContext);

  if (!context) {
    throw new Error("useNavbarMenu must be used within a NavbarMenu.");
  }

  return context;
};

interface NavbarMenuProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  delayCloseMs?: number;
}

const NavbarMenu = ({
  children,
  className,
  defaultOpen = false,
  delayCloseMs = 0,
  ...props
}: NavbarMenuProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    if (delayCloseMs <= 0) {
      setOpen(false);
      return;
    }
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, delayCloseMs);
  }, [delayCloseMs, clearCloseTimer]);

  const handleOpenState = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        clearCloseTimer();
        setOpen(true);
      } else {
        scheduleClose();
      }
    },
    [clearCloseTimer, scheduleClose],
  );

  const { hoverProps } = useHover({
    onHoverChange: handleOpenState,
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        setOpen(false);
      }
    },
    [clearCloseTimer],
  );

  return (
    <NavbarMenuContext.Provider value={{ open, setOpen }}>
      <div
        {...mergeProps(hoverProps, {
          onFocusCapture: () => {
            handleOpenState(true);
          },
          onBlurCapture: (event: React.FocusEvent<HTMLDivElement>) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              handleOpenState(false);
            }
          },
          onKeyDown: handleKeyDown,
        })}
        className={twMerge("relative min-w-0", className)}
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
    open && (
      <div
        className={twMerge(
          [
            "mt-1.5 flex flex-col ps-3 bg-bg",
            "md:absolute md:left-0 md:top-full md:z-50 md:min-w-48 md:overflow-hidden md:rounded-md md:border md:border-border md:bg-overlay md:p-1 md:ps-1 md:shadow-md md:text-fg",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  );
};

export type { NavbarItemProps };
export { NavbarItem, NavbarMenu, NavbarSubmenu };
