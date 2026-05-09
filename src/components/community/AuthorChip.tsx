import { Link } from "@tanstack/react-router";
import { EyeOff } from "lucide-react";
import type { AuthorRef } from "@/lib/community";
import { authorLabel } from "@/lib/community";

export function AuthorChip({ author, isAnonymous, size = "sm" }: { author: AuthorRef; isAnonymous: boolean; size?: "sm" | "md" }) {
  const label = authorLabel(author, isAnonymous);
  const sizeCls = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";

  const content = (
    <span className="inline-flex items-center gap-2">
      <span className={`flex items-center justify-center rounded-full font-700 ${sizeCls} ${isAnonymous ? "bg-muted text-muted-foreground" : "bg-bee-gold text-deep-night"}`}>
        {isAnonymous ? <EyeOff className="h-3 w-3" /> : label.initials}
      </span>
      <span className={`font-500 text-foreground ${size === "sm" ? "text-[12px]" : "text-sm"}`}>{label.name}</span>
    </span>
  );

  if (label.username) {
    return (
      <Link to="/community/u/$username" params={{ username: label.username }} className="hover:text-amber-brand transition">
        {content}
      </Link>
    );
  }
  return content;
}