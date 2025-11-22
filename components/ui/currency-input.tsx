"use client"

import * as React from "react"
import CurrencyInputField, { CurrencyInputProps as BaseCurrencyInputProps } from "react-currency-input-field"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps extends Omit<BaseCurrencyInputProps, "onValueChange"> {
  onValueChange?: (value: string | undefined, name?: string, values?: any) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <CurrencyInputField
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
