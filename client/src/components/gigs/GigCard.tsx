import { Link } from "react-router-dom";
import { Gig } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GigCardProps {
  gig: Gig;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <Link to={`/gigs/${gig._id}`}>
              <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                {gig.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <p className="text-sm text-muted-foreground">Posted by client</p>
            </div>
          </div>
          <Badge
            variant={gig.status === "open" ? "default" : "secondary"}
            className={gig.status === "open" ? "bg-success" : ""}
          >
            {gig.status === "open" ? "Open" : "Assigned"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {gig.description}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            <DollarSign className="h-4 w-4" />
            <span>${gig.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {formatDistanceToNow(new Date(gig.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <Link to={`/gigs/${gig._id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
