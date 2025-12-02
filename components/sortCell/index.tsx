import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

function SortCell({
  label,
  isAscSorted,
  className,
  onClick,
}: {
  label: string;
  isAscSorted: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded px-2 py-1 transition-colors",
        isAscSorted
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted",
        className
      )}
      onClick={onClick}
    >
      <span className="text-base">{label}</span>
      <span>
        <ChevronUp
          size={20}
          className={cn("-mb-2", isAscSorted ? "" : "opacity-30")}
        />
        <ChevronDown
          size={20}
          className={cn(isAscSorted ? "opacity-30" : "")}
        />
      </span>
    </div>
  );
}

export default SortCell;