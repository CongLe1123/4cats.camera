"use client";

import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

/**
 * MultiSelect component tailored for 4cats camera store.
 * - Single-line collapsed trigger matching standard SelectTrigger (h-9, rounded-xl)
 * - Compact chip display with individual remove buttons (×)
 * - Overflow badge (+N) preventing multi-row layout blowout
 * - Portal popover dropdown with checkboxes and optional search
 * - Keyboard accessible (Space/Enter to toggle, Escape to close, Tab navigation)
 */
export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Tất cả",
  searchPlaceholder = "Tìm tính năng...",
  emptyText = "Không tìm thấy tính năng",
  allLabel = "Tất cả / Xóa lựa chọn",
  className,
  id,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Normalize options: support string[] or { value, label }[]
  // Filter out "All" or "Tất cả" if present in raw options list
  const normalizedOptions = React.useMemo(() => {
    return options
      .map((opt) => {
        if (typeof opt === "string") {
          return { value: opt, label: opt };
        }
        return opt;
      })
      .filter(
        (opt) =>
          opt &&
          opt.value !== "All" &&
          opt.value !== "all" &&
          opt.label !== "All" &&
          opt.label !== "Tất cả"
      );
  }, [options]);

  const listboxId = React.useId();

  // Selected values as array of strings
  const selectedValues = React.useMemo(() => {
    return Array.isArray(value) ? value : [];
  }, [value]);

  // Filter options by search query
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const q = search.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [normalizedOptions, search]);

  const handleToggle = (val) => {
    const isSelected = selectedValues.includes(val);
    let next;
    if (isSelected) {
      next = selectedValues.filter((v) => v !== val);
    } else {
      next = [...selectedValues, val];
    }
    onChange?.(next);
  };

  const handleRemoveSingle = (e, val) => {
    e.stopPropagation();
    e.preventDefault();
    onChange?.(selectedValues.filter((v) => v !== val));
  };

  const handleClearAll = (e) => {
    e?.stopPropagation();
    onChange?.([]);
  };

  // Find labels for selected values
  const selectedLabels = React.useMemo(() => {
    return selectedValues.map((v) => {
      const found = normalizedOptions.find((opt) => opt.value === v);
      return found ? found.label : v;
    });
  }, [selectedValues, normalizedOptions]);

  const showSearch = normalizedOptions.length > 5;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-haspopup="listbox"
          aria-label="Lọc theo tính năng"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-xl border border-primary/20 bg-transparent px-3 py-1.5 text-sm shadow-sm ring-offset-background transition-all hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-left cursor-pointer select-none overflow-hidden",
            className
          )}
        >
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 mr-1 min-w-0">
            {selectedValues.length === 0 ? (
              <span className="text-foreground/90 truncate">{placeholder}</span>
            ) : selectedValues.length === 1 ? (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-lg max-w-[140px] truncate shrink-0">
                <span className="truncate">{selectedLabels[0]}</span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Xóa ${selectedLabels[0]}`}
                  onClick={(e) => handleRemoveSingle(e, selectedValues[0])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleRemoveSingle(e, selectedValues[0]);
                    }
                  }}
                  className="p-0.5 rounded-full hover:bg-primary/20 text-primary hover:text-primary-foreground shrink-0 cursor-pointer inline-flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ) : (
              <div className="flex items-center gap-1 overflow-hidden min-w-0">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-lg max-w-[105px] truncate shrink-0">
                  <span className="truncate">{selectedLabels[0]}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Xóa ${selectedLabels[0]}`}
                    onClick={(e) => handleRemoveSingle(e, selectedValues[0])}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleRemoveSingle(e, selectedValues[0]);
                      }
                    }}
                    className="p-0.5 rounded-full hover:bg-primary/20 text-primary hover:text-primary-foreground shrink-0 cursor-pointer inline-flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
                <span className="inline-flex items-center bg-primary/15 text-primary text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                  +{selectedValues.length - 1}
                </span>
              </div>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[240px] sm:w-[260px] p-2 rounded-2xl border border-primary/20 bg-white/95 backdrop-blur-md shadow-xl z-[200]"
      >
        {/* Search Bar if > 5 options */}
        {showSearch && (
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-7 text-xs rounded-xl border border-primary/15 bg-muted/30 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Action Header: "Tất cả / Xóa lựa chọn" */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-1 border-b border-primary/10">
          <button
            type="button"
            onClick={handleClearAll}
            className={cn(
              "text-xs font-semibold transition-colors flex items-center gap-1.5 rounded-md px-1.5 py-0.5",
              selectedValues.length === 0
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            {selectedValues.length === 0 && <Check className="w-3 h-3 text-primary" />}
            {allLabel}
          </button>
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-bold text-[#FF3377] hover:underline cursor-pointer"
            >
              Bỏ chọn ({selectedValues.length})
            </button>
          )}
        </div>

        {/* Options List */}
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="max-h-60 overflow-y-auto space-y-0.5 pr-1 py-1"
        >
          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground italic">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isChecked = selectedValues.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => handleToggle(opt.value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-left transition-colors cursor-pointer select-none group min-h-[38px]",
                    isChecked
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-primary/5"
                  )}
                >
                  {/* Custom Checkbox */}
                  <span
                    className={cn(
                      "w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                      isChecked
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-muted-foreground/30 bg-white group-hover:border-primary/50"
                    )}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>

                  <span className="flex-1 truncate">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
