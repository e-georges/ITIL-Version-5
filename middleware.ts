import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-card p-5 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

// Carte "intercalaire" — référence directe à l'onglet d'un classeur scolaire.
// Élément signature utilisé pour les matières sur le dashboard élève.
export function TabCard({
  color,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { color: string }) {
  return (
    <div className={cn("relative pt-3", className)} {...props}>
      <div
        className="absolute -top-0 left-4 h-3 w-12 rounded-tab"
        style={{ backgroundColor: color }}
      />
      <div className="bg-surface border border-border rounded-card p-5 shadow-sm">
        {props.children}
      </div>
    </div>
  );
}
