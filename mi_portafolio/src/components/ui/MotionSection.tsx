import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "./utils";

/**
 * A <section> wrapper that fades in and slides up when it enters the viewport.
 * Uses IntersectionObserver so no external animation library is needed.
 */
export function MotionSection({ className, children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
