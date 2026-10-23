"use client";
import {
  useEffect,
  useEffectEvent,
  useState,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { CheckIcon, CloseIcon, SparklesIcon } from "@/components/ui/icons";
import { useLocale } from "@/lib/i18n.client";

export type ToastVariant = "success" | "info" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "success",
      durationMs = 4500,
    }: Omit<ToastItem, "id">) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now());
      setToasts((prev) => [
        ...prev.slice(-2),
        { id, title, description, variant, durationMs },
      ]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Fixed bottom-right notification portal */}
      <aside
        aria-label={locale === "es" ? "Notificaciones" : "Notifications"}
        className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex flex-col gap-3 sm:left-auto sm:right-6 sm:w-96"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast requires ToastProvider");
  return context;
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const { title, description, variant = "success", durationMs = 4500 } = toast;
  const { locale } = useLocale();

  const dismiss = useEffectEvent(() => onDismiss(toast.id));

  // Exception: a timer must be acquired on mount and disposed on unmount.
  // An event-only timer would outlive removal; Effect Event keeps callbacks fresh without resetting the deadline.
  useEffect(() => {
    if (durationMs <= 0) return;
    const timer = setTimeout(() => dismiss(), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  const iconBg =
    variant === "success"
      ? "bg-success text-success-foreground"
      : variant === "error"
        ? "bg-danger text-danger-foreground"
        : "bg-primary text-primary-foreground";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className="pointer-events-auto flex items-center gap-3 rounded-xl border border-inverse-foreground/15 bg-foreground p-3 text-inverse-foreground shadow-elevated"
    >
      <div
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-control ${iconBg}`}
      >
        {variant === "success" ? (
          <CheckIcon size={20} />
        ) : variant === "error" ? (
          <CloseIcon size={20} />
        ) : (
          <SparklesIcon size={20} />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <h3 className="text-sm font-semibold leading-snug">{title}</h3>
        {description && (
          <p className="mt-1 break-words text-xs leading-relaxed text-inverse-foreground/75 [overflow-wrap:anywhere]">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={
          locale === "es" ? "Cerrar notificación" : "Dismiss notification"
        }
        className="flex size-11 shrink-0 items-center justify-center rounded-control text-inverse-foreground/70 transition-colors hover:bg-inverse-foreground/10 hover:text-inverse-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-accent"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}

/**
 * Standalone direct Toast component for isolated usage without Provider.
 */
export function StandaloneToast({
  open,
  onClose,
  title,
  description,
  variant = "success",
  durationMs = 4000,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-x-4 bottom-6 z-50 sm:left-auto sm:right-6 sm:w-96">
      <ToastCard
        toast={{ id: "standalone", title, description, variant, durationMs }}
        onDismiss={onClose}
      />
    </div>
  );
}
