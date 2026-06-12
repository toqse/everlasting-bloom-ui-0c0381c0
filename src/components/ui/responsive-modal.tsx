"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Extra classes applied to the scrollable body wrapper. */
  bodyClassName?: string;
  /** Extra classes applied to the panel container. */
  contentClassName?: string;
}

const ANIMATION_MS = 220;

/**
 * A self-contained, accessible modal that renders a centered dialog on desktop
 * and a bottom sheet (drawer) on mobile.
 *
 * It intentionally avoids trapping focus or locking body `pointer-events`, so
 * portal-based controls rendered to `document.body` (e.g. SearchableSelect's
 * dropdown) keep working while the modal is open.
 */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  bodyClassName,
  contentClassName,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Mobile drag-to-dismiss state.
  const dragStartY = React.useRef<number | null>(null);
  const [dragOffset, setDragOffset] = React.useState(0);

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // Lock body scroll while mounted (without touching pointer-events).
  React.useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Move focus into the panel when it opens.
  React.useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  React.useEffect(() => {
    if (!visible) setDragOffset(0);
  }, [visible]);

  if (!mounted || typeof document === "undefined") return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current == null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragOffset(Math.max(0, delta));
  };
  const handleTouchEnd = () => {
    if (dragOffset > 120) {
      close();
    } else {
      setDragOffset(0);
    }
    dragStartY.current = null;
  };

  const header = (
    <div
      className={cn(
        "relative shrink-0 border-b border-primary/10 px-4 sm:px-6 pt-4 sm:pt-6 pb-4",
        isMobile && "pt-2",
      )}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {isMobile && (
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-muted" />
      )}
      {title && (
        <h2 className="font-serif text-lg sm:text-xl font-bold text-secondary pr-10">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground pr-10">
          {description}
        </p>
      )}
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className={cn(
          "absolute right-3 sm:right-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isMobile ? "top-3" : "top-5",
        )}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );

  const body = (
    <div
      className={cn(
        "flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5",
        bodyClassName,
      )}
    >
      {children}
    </div>
  );

  const footerEl = footer ? (
    <div className="shrink-0 border-t border-primary/10 px-4 sm:px-6 py-3 sm:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4 flex justify-end gap-2">
      {footer}
    </div>
  ) : null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />

      {isMobile ? (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "relative z-10 mt-auto flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-primary/10 bg-[hsl(350_60%_98%)] shadow-2xl outline-none transition-transform duration-200 ease-out",
            contentClassName,
          )}
          style={{
            transform:
              visible && dragStartY.current == null && dragOffset === 0
                ? "translateY(0)"
                : visible
                  ? `translateY(${dragOffset}px)`
                  : "translateY(100%)",
            transitionProperty:
              dragStartY.current != null ? "none" : "transform",
          }}
        >
          {header}
          {body}
          {footerEl}
        </div>
      ) : (
        <div className="relative z-10 m-auto flex w-full justify-center px-4 py-6">
          <div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-primary/10 bg-[hsl(350_60%_98%)] shadow-2xl outline-none transition-all duration-200",
              visible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-2",
              contentClassName,
            )}
          >
            {header}
            {body}
            {footerEl}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
