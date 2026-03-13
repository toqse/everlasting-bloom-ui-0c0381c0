import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { labelClass } from "@/components/signup/SignupFormFields";

const DEBOUNCE_MS = 300;

export interface SearchableOption {
  id: number;
  name: string;
}

interface SearchableSelectProps {
  name: string;
  value: string;
  options: SearchableOption[];
  loading: boolean;
  label: string;
  placeholder: string;
  disabled?: boolean;
  onSearch: (term: string) => void;
  onSelect: (name: string, value: string) => void;
}

export function SearchableSelect({
  name,
  value,
  options,
  loading,
  label,
  placeholder,
  disabled,
  onSearch,
  onSelect,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const updatePosition = useCallback(() => {
    const el = containerRef.current?.querySelector("button");
    if (el) {
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (open) {
      setSearchTerm("");
      setDebouncedTerm("");
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (open) onSearch(debouncedTerm);
  }, [open, debouncedTerm, onSearch]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    const isTrigger = containerRef.current?.contains(target);
    const isOverlay = overlayRef.current?.contains(target);
    if (!isTrigger && !isOverlay) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  const selectedOption = value ? options.find((o) => o.id === Number(value)) : null;
  const displayLabel = selectedOption?.name ?? placeholder;

  const handleSelect = (option: SearchableOption) => {
    onSelect(name, String(option.id));
    setOpen(false);
    setSearchTerm("");
  };

  const dropdownContent = open && position.width > 0 && (
    <div
      ref={overlayRef}
      className="fixed z-[100] rounded-2xl border-2 border-primary/10 bg-white shadow-xl overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        width: Math.max(position.width, 200),
        minWidth: 200,
      }}
    >
      <div className="p-2 border-b border-primary/10 bg-muted/30">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-2 rounded-xl border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          autoFocus
        />
      </div>
      <div className="max-h-56 overflow-y-auto p-1">
        {loading ? (
          <div className="py-6 text-center text-muted-foreground text-sm">Loading...</div>
        ) : options.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-sm">No results</div>
        ) : (
          options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                opt.id === Number(value)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
            >
              {opt.name}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      {label ? <label className={labelClass}>{label}</label> : null}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full px-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-white text-left flex items-center justify-between gap-2 text-foreground disabled:opacity-60"
      >
        <span className={value ? "" : "text-muted-foreground"}>{displayLabel}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
    </div>
  );
}
