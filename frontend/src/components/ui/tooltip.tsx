import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

const sideClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <div className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "absolute z-50 hidden overflow-hidden rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-md group-hover/tooltip:block",
          sideClasses[side]
        )}
      >
        {content}
      </span>
    </div>
  )
}
Tooltip.displayName = "Tooltip"

export { Tooltip }
