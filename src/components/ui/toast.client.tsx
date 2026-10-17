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
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
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

  const dismiss = useEffectEvent(() => onDismiss(toast.id));

  // Exception: a timer must be acquired on mount and disposed on unmount.
  // An event-only timer would outlive removal; Effect Event keeps callbacks fresh without resetting the deadline.
  useEffect(() => {
    if (durationMs <= 0) return;
    const timer = setTimeout(() => dismiss(), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  const borderClass =
    variant === "success"
      ? "border-success"
      : variant === "error"
        ? "border-danger"
        : "border-border";

  const iconBg =
    variant === "success"
      ? "bg-success-surface text-success"
      : variant === "error"
        ? "bg-danger-surface text-danger"
        : "bg-surface-muted text-primary";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto flex items-start gap-3 rounded-panel border ${borderClass} bg-surface-raised p-4 shadow-panel transition-colors motion-reduce:transition-none`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        {variant === "success" ? (
          <CheckIcon size={14} className="text-success" />
        ) : (
          <SparklesIcon size={14} />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
            NOTIFICATION
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            · NOW
          </span>
        </div>
        <h3 className="font-sans text-xs font-bold text-foreground mt-0.5">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 font-sans text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
      >
        <CloseIcon size={13} />
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
    <div className="fixed bottom-5 right-5 z-50 max-w-sm px-4">
      <ToastCard
        toast={{ id: "standalone", title, description, variant, durationMs }}
        onDismiss={onClose}
      />
    </div>
  );
}
