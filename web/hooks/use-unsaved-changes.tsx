import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import {
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type UnsavedChangesState = {
  isDirty: boolean;
  onSave: () => Promise<boolean> | boolean | void;
};

type UnsavedChangesContextType = {
  setDirty: (id: string, isDirty: boolean, onSave: () => Promise<boolean> | boolean | void) => void;
  removeDirty: (id: string) => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(null);

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [dirtyStates, setDirtyStates] = useState<Record<string, UnsavedChangesState>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingVisit, setPendingVisit] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const bypassRef = useRef(false);
  const onSaveRefs = useRef<Record<string, () => Promise<boolean> | boolean | void>>({});

  const setDirty = useCallback((id: string, isDirty: boolean, onSave: () => Promise<boolean> | boolean | void) => {
    onSaveRefs.current[id] = onSave;

    setDirtyStates((prev) => {
      if (prev[id]?.isDirty === isDirty) {
        return prev;
      }

      return { ...prev, [id]: { isDirty, onSave } };
    });
  }, []);

  const removeDirty = useCallback((id: string) => {
    delete onSaveRefs.current[id];

    setDirtyStates((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const isAnyDirty = Object.values(dirtyStates).some((d) => d.isDirty);

  // Intercept Inertia visits
  useEffect(() => {
    const removeListener = router.on("before", (event) => {
      if (bypassRef.current) {
        bypassRef.current = false;
        return;
      }

      if (isAnyDirty) {
        event.preventDefault();
        setPendingVisit(event.detail.visit);
        setIsModalOpen(true);
      }
    });

    return () => {
      removeListener();
    };
  }, [isAnyDirty]);

  // Intercept native browser close/reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyDirty) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAnyDirty]);

  // Actions
  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingVisit(null);
  };

  const handleDiscard = () => {
    setIsModalOpen(false);
    if (pendingVisit) {
      bypassRef.current = true;
      router.visit(pendingVisit.url, pendingVisit);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let allSaved = true;

      // Filter states that are actually dirty
      const dirtyEntries = Object.entries(dirtyStates).filter(([_, d]) => d.isDirty);

      for (const [id, state] of dirtyEntries) {
        const onSave = onSaveRefs.current[id] ?? state.onSave;
        const resultPromise = new Promise<boolean>((resolve) => {
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

          // Trigger the config's save
          try {
            const saveRes = onSave();
            if (saveRes instanceof Promise) {
              saveRes.then(
                (val) => {
                  if (val === false) {
                    if (!resolved) {
                      resolved = true;
                      removeSuccess();
                      removeError();
                      resolve(false);
                    }
                  }
                },
                () => {
                  if (!resolved) {
                    resolved = true;
                    removeSuccess();
                    removeError();
                    resolve(false);
                  }
                }
              );
            } else if (saveRes === false) {
              if (!resolved) {
                resolved = true;
                removeSuccess();
                removeError();
                resolve(false);
              }
            } else if (saveRes === true || saveRes === undefined) {
              // Standard timeout fallback for synchronous saves
              setTimeout(() => {
                if (!resolved) {
                  resolved = true;
                  removeSuccess();
                  removeError();
                  resolve(true);
                }
              }, 100);
            }
          } catch (err) {
            console.error("Save error:", err);
            if (!resolved) {
              resolved = true;
              removeSuccess();
              removeError();
              resolve(false);
            }
          }
        });

        const success = await resultPromise;
        if (!success) {
          allSaved = false;
          break;
        }
      }

      if (allSaved) {
        setIsModalOpen(false);
        if (pendingVisit) {
          bypassRef.current = true;
          router.visit(pendingVisit.url, pendingVisit);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UnsavedChangesContext.Provider value={{ setDirty, removeDirty }}>
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
              Bạn đã thực hiện các thay đổi trên trang này. Bạn có muốn lưu lại trước khi rời đi không?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="flex-row-reverse sm:flex-row justify-end gap-2">
            <div className="flex items-center gap-2">
              <Button intent="outline" onPress={handleCancel} isDisabled={isSaving}>
                Hủy
              </Button>
              <Button intent="secondary" onPress={handleDiscard} isDisabled={isSaving}>
                Không lưu
              </Button>
              <Button intent="primary" onPress={handleSave} isDisabled={isSaving}>
                Lưu
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      )}
    </UnsavedChangesContext.Provider>
  );
}

export function useRegisterUnsavedChanges(config: { isDirty: boolean; onSave: () => Promise<boolean> | boolean | void }, id = "default") {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useRegisterUnsavedChanges must be used within an UnsavedChangesProvider");
  }

  const { setDirty, removeDirty } = context;
  const onSaveRef = useRef(config.onSave);

  useEffect(() => {
    onSaveRef.current = config.onSave;
  }, [config.onSave]);

  useEffect(() => {
    setDirty(id, config.isDirty, () => onSaveRef.current());
    return () => {
      removeDirty(id);
    };
  }, [id, config.isDirty, setDirty, removeDirty]);
}
