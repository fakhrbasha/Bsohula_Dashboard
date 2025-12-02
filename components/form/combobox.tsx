import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { cn } from '@/lib/utils'

const CustomCombobox = ({data , description , className} :{data:any[] , description:string , className?:string}) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    return (
        <div>
         <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className ?? "w-[200px] justify-between"}
        >
          {value
            ? data.find((ele) => ele.name === value)?.name
            : `Select ${description}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${description}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {description} found.</CommandEmpty>
            <CommandGroup>
              {data.map((ele) => (
                <CommandItem
                  key={ele.id}
                  value={ele.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {ele.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === ele.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
        </div>
    )
}

export default CustomCombobox
