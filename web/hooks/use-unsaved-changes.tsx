import { router } from "@inertiajs/react";
import React, { createContext, use, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import { shouldInterceptUnsavedAnchorNavigation } from "@/hooks/unsaved-navigation";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { t } from "@/lib/i18n";

type UnsavedChangesState = {
  isDirty: boolean;
  onSave: () => Promise<boolean> | boolean | void;
};

type PendingNavigation =
  | { kind: "history-back" }
  | { kind: "href"; href: string }
  | { kind: "inertia"; visit: any };

type UnsavedChangesContextType = {
  setDirty: (
    id: string,
    isDirty: boolean,
    onSave: () => Promise<boolean> | boolean | void,
  ) => void;
  removeDirty: (id: string) => void;
};

function saveDirtyEntry(
  id: string,
  state: UnsavedChangesState,
  onSaveRef: Record<string, () => Promise<boolean> | boolean | void>,
): Promise<boolean> {
  const onSave =
    (Reflect.get(onSaveRef, id) as
      | (() => Promise<boolean> | boolean | void)
      | undefined) ?? state.onSave;

  return new Promise<boolean>((resolve) => {
    let resolved = false;

    const removeSuccess = router.on("success", () => {
      if (!resolved) {
        resolved = true;
        removeSuccess();
        removeError();
        resolve(true);
      }
    });

    const removeError = router.on("error", () => {
      if (!resolved) {
        resolved = true;
        removeSuccess();
        removeError();
        resolve(false);
      }
    });

    try {
      const saveResult = onSave();

      if (saveResult instanceof Promise) {
        saveResult.then(
          (value) => {
            if (value === false && !resolved) {
              resolved = true;
              removeSuccess();
              removeError();
              resolve(false);
            }
          },
          () => {
            if (!resolved) {
              resolved = true;
              removeSuccess();
              removeError();
              resolve(false);
            }
          },
        );

        return;
      }

      if (saveResult === false) {
        resolved = true;
        removeSuccess();
        removeError();
        resolve(false);

        return;
      }

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          removeSuccess();
          removeError();
          resolve(true);
        }
      }, 100);
    } catch (error) {
      console.error("Save error:", error);

      if (!resolved) {
        resolved = true;
        removeSuccess();
        removeError();
        resolve(false);
      }
    }
  });
}

async function saveDirtyEntriesSequentially(
  dirtyEntries: Array<[string, UnsavedChangesState]>,
  onSaveRef: Record<string, () => Promise<boolean> | boolean | void>,
  index = 0,
): Promise<boolean> {
  const currentEntry = dirtyEntries.at(index);

  if (!currentEntry) {
    return true;
  }

  const [id, state] = currentEntry;
  const didSave = await saveDirtyEntry(id, state, onSaveRef);

  if (!didSave) {
    return false;
  }

  return saveDirtyEntriesSequentially(dirtyEntries, onSaveRef, index + 1);
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(
  null,
);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bypassRef = useRef(false);
  const dirtyStatesRef = useRef<Record<string, UnsavedChangesState>>({});
  const onSaveRefs = useRef<
    Record<string, () => Promise<boolean> | boolean | void>
  >({});
  const isAnyDirtyRef = useRef(false);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const [contextValue] = useState<UnsavedChangesContextType>(() => ({
    setDirty(id, isDirty, onSave) {
      if (id === "__proto__" || id === "constructor" || id === "prototype") {
        return;
      }

      const safeId = `safe_${id}`;
      onSaveRefs.current[safeId] = onSave;
      dirtyStatesRef.current[safeId] = { isDirty, onSave };
      isAnyDirtyRef.current = Object.values(dirtyStatesRef.current).some(
        (state) => state.isDirty,
      );
    },
    removeDirty(id) {
      if (id === "__proto__" || id === "constructor" || id === "prototype") {
        return;
      }

      const safeId = `safe_${id}`;
      delete onSaveRefs.current[safeId];
      delete dirtyStatesRef.current[safeId];
      isAnyDirtyRef.current = Object.values(dirtyStatesRef.current).some(
        (state) => state.isDirty,
      );
    },
  }));

  useMountEffect(() => {
    const removeListener = router.on("before", (event) => {
      if (bypassRef.current) {
        bypassRef.current = false;

        return;
      }

      const visitMethod = String(
        event.detail.visit.method ?? "get",
      ).toLowerCase();

      if (visitMethod !== "get") {
        return;
      }

      if (isAnyDirtyRef.current) {
        event.preventDefault();
        pendingNavigationRef.current = {
          kind: "inertia",
          visit: event.detail.visit,
        };
        setIsModalOpen(true);
      }
    });

    return () => {
      removeListener();
    };
  });

  useMountEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (bypassRef.current || !isAnyDirtyRef.current) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const shouldIntercept = shouldInterceptUnsavedAnchorNavigation({
        altKey: event.altKey,
        button: event.button,
        ctrlKey: event.ctrlKey,
        currentUrl: window.location.href,
        defaultPrevented: event.defaultPrevented,
        download: anchor.hasAttribute("download"),
        href: anchor.href,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        target: anchor.getAttribute("target"),
      });

      if (!shouldIntercept) {
        return;
      }

      event.preventDefault();
      pendingNavigationRef.current = {
        kind: "href",
        href: anchor.href,
      };
      setIsModalOpen(true);
    };

    const handlePopState = () => {
      if (bypassRef.current) {
        bypassRef.current = false;

        return;
      }

      if (!isAnyDirtyRef.current) {
        return;
      }

      window.history.forward();
      pendingNavigationRef.current = {
        kind: "history-back",
      };
      setIsModalOpen(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (bypassRef.current || !isAnyDirtyRef.current) {
        return;
      }

      if (isAnyDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?";
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  // Actions
  const handleCancel = () => {
    setIsModalOpen(false);
    pendingNavigationRef.current = null;
  };

  const continuePendingNavigation = () => {
    const pendingNavigation = pendingNavigationRef.current;

    if (!pendingNavigation) {
      return;
    }

    bypassRef.current = true;

    if (pendingNavigation.kind === "history-back") {
      pendingNavigationRef.current = null;
      window.history.back();

      return;
    }

    if (pendingNavigation.kind === "href") {
      pendingNavigationRef.current = null;
      router.visit(pendingNavigation.href);

      return;
    }

    pendingNavigationRef.current = null;
    router.visit(pendingNavigation.visit.url, pendingNavigation.visit);
  };

  const handleDiscard = () => {
    setIsModalOpen(false);
    continuePendingNavigation();
  };

  const handleSave = async () => {
    setIsSaving(true);
    const dirtyEntries = Object.entries(dirtyStatesRef.current).filter(
      ([_, state]) => state.isDirty,
    );

    try {
      const allSaved = await saveDirtyEntriesSequentially(
        dirtyEntries,
        onSaveRefs.current,
      );

      if (allSaved) {
        setIsModalOpen(false);
        continuePendingNavigation();

        return;
      }

      setIsModalOpen(false);
      pendingNavigationRef.current = null;
    } catch (error) {
      console.error("Unsaved changes save error:", error);
    }

    setIsSaving(false);
  };

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}

      {isModalOpen && (
        <ModalContent
          aria-label="Xác nhận thay đổi chưa lưu"
          isOpen={isModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              handleCancel();
            }
          }}
          size="md"
        >
          <ModalHeader>
            <ModalTitle>Bạn có thay đổi chưa lưu</ModalTitle>
            <ModalDescription>
              Bạn đã thực hiện các thay đổi trên trang này. Bạn có muốn lưu lại
              trước khi rời đi không?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="flex-row-reverse sm:flex-row justify-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                intent="outline"
                onPress={handleCancel}
                isDisabled={isSaving}
              >
                Hủy
              </Button>
              <Button
                intent="secondary"
                onPress={handleDiscard}
                isDisabled={isSaving}
              >
                {t("Không lưu")}
              </Button>
              <Button
                intent="primary"
                onPress={handleSave}
                isDisabled={isSaving}
              >
                Lưu
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      )}
    </UnsavedChangesContext.Provider>
  );
}

export function useRegisterUnsavedChanges(
  config: { isDirty: boolean; onSave: () => Promise<boolean> | boolean | void },
  id = "default",
) {
  const context = use(UnsavedChangesContext);

  if (!context) {
    throw new Error(
      "useRegisterUnsavedChanges must be used within an UnsavedChangesProvider",
    );
  }

  const { setDirty, removeDirty } = context;
  setDirty(id, config.isDirty, config.onSave);

  useMountEffect(() => {
    return () => {
      removeDirty(id);
    };
  });
}
