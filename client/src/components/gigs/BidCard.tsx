import { Bid } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, User, MessageSquare, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BidCardProps {
  bid: Bid;
  isOwner: boolean;
  onHire?: (bidId: string) => void;
  isHiring?: boolean;
}

export function BidCard({ bid, isOwner, onHire, isHiring }: BidCardProps) {
  const statusColors = {
    pending: "bg-warning/10 text-warning border-warning/20",
    hired: "bg-success/10 text-success border-success/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        bid.status === "hired" ? "ring-2 ring-success/50" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Freelancer</h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(bid.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[bid.status]}>
            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="line-clamp-3">{bid.message}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-lg font-semibold text-primary">
          <DollarSign className="h-5 w-5" />
          <span>${bid.price.toLocaleString()}</span>
        </div>

        {isOwner && bid.status === "pending" && onHire && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onHire(bid._id)}
            disabled={isHiring}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isHiring ? "Hiring..." : "Hire"}
          </Button>
        )}

        {bid.status === "hired" && (
          <div className="flex items-center gap-2 text-success text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Hired
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
