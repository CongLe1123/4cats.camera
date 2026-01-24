"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

export function CreatableSelect({
  options = [],
  value,
  onChange,
  onCreate,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No item found.",
  createLabel = "Create",
  isLoading = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleCreate = async () => {
    if (!search) return;
    if (onCreate) {
        // Wait for creation
        await onCreate(search);
        // We assume onCreate will also trigger a refresh or return the new ID, 
        // but typically the parent will update the 'options' prop and 'value' prop.
        setSearch("");
        setOpen(false);
    }
  };

  // Filter existing options
  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const exactMatch = filtered.some(opt => opt.label.toLowerCase() === search.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedLabel ? selectedLabel : <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : (
                <>
                     {filtered.length === 0 && !search && (
                        <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
                     )}
                     
                     <CommandGroup heading="Suggestions">
                        {filtered.map((option) => (
                        <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                                onChange(currentValue === value ? "" : currentValue);
                                setOpen(false);
                            }}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                value === option.value ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {option.label}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                </>
            )}

            {!exactMatch && search && onCreate && (
                <>
                    <CommandSeparator />
                    <CommandGroup>
                        <CommandItem onSelect={handleCreate} className="cursor-pointer text-primary font-bold">
                            <Plus className="mr-2 h-4 w-4" />
                            {createLabel} "{search}"
                        </CommandItem>
                    </CommandGroup>
                </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
