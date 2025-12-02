"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

interface CustomComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  clearable?: boolean
}

export function CustomCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  disabled = false,
  className,
  clearable = true,
}: CustomComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value)
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1)
  const comboboxRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listboxRef = React.useRef<HTMLDivElement>(null)

  // Sync internal state with external value
  React.useEffect(() => {
    setSelectedValue(value)
    if (value) {
      const selectedOption = options.find((option) => option.value === value)
      setInputValue(selectedOption?.label || "")
    }
  }, [value, options])

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) return options
    return options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
  }, [options, inputValue])

  // Handle outside click to close dropdown
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (!open) {
          setOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (!open) {
          setOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
        }
        break
      case "Enter":
        e.preventDefault()
        if (open && highlightedIndex >= 0) {
          selectOption(filteredOptions[highlightedIndex])
        } else {
          setOpen((prev) => !prev)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
      case "Tab":
        if (open) {
          setOpen(false)
        }
        break
    }
  }

  // Scroll highlighted option into view
  React.useEffect(() => {
    if (open && highlightedIndex >= 0 && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, open])

  // Select an option
  const selectOption = (option: ComboboxOption) => {
    if (option.disabled) return

    setSelectedValue(option.value)
    setInputValue(option.label)
    setOpen(false)
    setHighlightedIndex(-1)

    if (onValueChange) {
      onValueChange(option.value)
    }

    // Return focus to input after selection
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Clear selection
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedValue(undefined)
    setInputValue("")

    if (onValueChange) {
      onValueChange("")
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setOpen(true)

    // Reset selection if input doesn't match
    if (selectedValue) {
      const selectedOption = options.find((option) => option.value === selectedValue)
      if (selectedOption && e.target.value !== selectedOption.label) {
        setSelectedValue(undefined)
        if (onValueChange) {
          onValueChange("")
        }
      }
    }
  }

  // Get display value
  const getDisplayValue = () => {
    if (inputValue) return inputValue
    if (selectedValue) {
      const selectedOption = options.find((option) => option.value === selectedValue)
      return selectedOption?.label || ""
    }
    return ""
  }

  return (
    <div ref={comboboxRef} className={cn("relative w-full", className)} onKeyDown={handleKeyDown}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10", selectedValue && clearable && "pr-16")}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={open ? "custom-combobox-listbox" : undefined}
          aria-activedescendant={
            open && highlightedIndex >= 0 ? `option-${filteredOptions[highlightedIndex]?.value}` : undefined
          }
          role="combobox"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {selectedValue && clearable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={clearSelection}
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setOpen(!open)}
            tabIndex={-1}
            aria-label={open ? "Close" : "Open"}
            disabled={disabled}
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">{open ? "Close" : "Open"}</span>
          </Button>
        </div>
      </div>

      {open && (
        <div
          ref={listboxRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          role="listbox"
          id="custom-combobox-listbox"
          tabIndex={-1}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                id={`option-${option.value}`}
                role="option"
                aria-selected={selectedValue === option.value}
                aria-disabled={option.disabled}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  selectedValue === option.value && "bg-accent text-accent-foreground",
                  highlightedIndex === index && "bg-accent text-accent-foreground",
                  option.disabled && "pointer-events-none opacity-50",
                  !option.disabled && "cursor-pointer",
                )}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="flex-1">{option.label}</span>
                {selectedValue === option.value && <Check className="h-4 w-4 ml-2" />}
              </div>
            ))
          ) : (
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
