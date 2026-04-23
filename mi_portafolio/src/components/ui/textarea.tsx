import * as React from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none flex field-sizing-content min-h-16 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none",
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
