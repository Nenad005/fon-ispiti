"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function InputDrowpdown({ disabled = false, dropdown_items = []}: { disabled?: boolean, dropdown_items?: string[]}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sample dropdown items
  const dropdownItems = dropdown_items

  // Filter items based on input value
  const filteredItems = dropdownItems.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      setInputValue(e.target.value)
      setIsOpen(true)
    }
  }

  const handleItemClick = (item: string) => {
    setInputValue(item)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={`${disabled && "cursor-not-allowed"}`}>
      <div className="relative">
        {/* Input Element */}
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder="Unesi ili izaberi predmet..."
            disabled={disabled}
            className="pl-8 text-sm"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className={`h-4 w-4 ${disabled ? "text-muted-foreground/50" : "text-muted-foreground"}`} />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto"
          >
            {filteredItems.length > 0 ? (
              <div className="p-1">
                {filteredItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemClick(item)}
                    className="w-full justify-start h-8 px-2 font-normal"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
