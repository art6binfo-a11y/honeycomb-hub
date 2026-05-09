import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { castVote, type TargetType } from "@/lib/community";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function VoteButtons({
  targetType,
  targetId,
  initialScore,
  initialVote,
  size = "md",
}: {
  targetType: TargetType;
  targetId: string;
  initialScore: number;
  initialVote?: number;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState(initialVote ?? 0);

  const handle = async (value: 1 | -1) => {
    if (!user) {
      toast("Sign in to vote", {
        action: { label: "Sign in", onClick: () => navigate({ to: "/login", search: { redirect: window.location.pathname } }) },
      });
      return;
    }
    const prev = vote;
    const optimistic = prev === value ? 0 : value;
    setVote(optimistic);
    setScore((s) => s - prev + optimistic);
    try {
      await castVote(user.id, targetType, targetId, value);
    } catch {
      // revert
      setVote(prev);
      setScore((s) => s - optimistic + prev);
      toast.error("Vote failed");
    }
  };

  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={() => handle(1)}
        aria-label="Upvote"
        className={cn(
          dim,
          "rounded-md border border-border flex items-center justify-center transition",
          vote === 1 ? "bg-bee-gold text-deep-night border-bee-gold" : "text-muted-foreground hover:text-bee-gold hover:border-bee-gold",
        )}
      >
        <ArrowUp className={iconSize} />
      </button>
      <span className={cn("font-700 text-foreground", size === "sm" ? "text-xs" : "text-sm")}>{score}</span>
      <button
        onClick={() => handle(-1)}
        aria-label="Downvote"
        className={cn(
          dim,
          "rounded-md border border-border flex items-center justify-center transition",
          vote === -1 ? "bg-destructive text-destructive-foreground border-destructive" : "text-muted-foreground hover:text-destructive hover:border-destructive",
        )}
      >
        <ArrowDown className={iconSize} />
      </button>
    </div>
  );
}