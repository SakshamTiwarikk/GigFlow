import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BidCard } from "@/components/gigs/BidCard";
import { useGigs } from "@/context/GigContext";
import { useBids } from "@/context/BidContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  Clock,
  User,
  ArrowLeft,
  Send,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function GigDetail() {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();

  // 🔥 IMPORTANT: get isLoading from GigContext
  const { getGigById, isLoading } = useGigs();
  const { bids, fetchBidsForGig, submitBid, hireBid } = useBids();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [bidMessage, setBidMessage] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHiring, setIsHiring] = useState(false);

  const gig = getGigById(gigId || "");
  const gigBids = bids[gigId || ""] || [];

  const isOwner = user?._id === gig?.ownerId;
  const hasAlreadyBid = gigBids.some((bid) => bid.freelancerId === user?._id);

  // Fetch bids when page loads
  useEffect(() => {
    if (gigId) {
      fetchBidsForGig(gigId);
    }
  }, [gigId]);

  // ⏳ WAIT for gigs to load
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading gig...</p>
        </div>
      </Layout>
    );
  }

  // ❌ Gig truly not found (after loading)
  if (!gig) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Gig not found</h2>
          <p className="text-muted-foreground mb-6">
            This gig may have been removed or doesn&apos;t exist.
          </p>
          <Button onClick={() => navigate("/gigs")}>Browse Gigs</Button>
        </div>
      </Layout>
    );
  }

  // Submit bid
  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitBid(gig._id, bidMessage, Number(bidPrice));
      toast({
        title: "Bid submitted!",
        description: "Your bid has been sent to the client.",
      });
      setBidMessage("");
      setBidPrice("");
      await fetchBidsForGig(gig._id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hire freelancer
  const handleHire = async (bidId: string) => {
    setIsHiring(true);
    try {
      await hireBid(bidId);
      toast({
        title: "Freelancer hired!",
        description: "The freelancer has been notified.",
      });
      await fetchBidsForGig(gigId!);
    } finally {
      setIsHiring(false);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/gigs")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gigs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{gig.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <User className="h-4 w-4" />
                      <span>Posted by client</span>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>
                        {formatDistanceToNow(new Date(gig.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={gig.status === "open" ? "bg-success" : ""}>
                    {gig.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold text-primary mb-6">
                  ${gig.budget}
                </div>
                <Separator className="mb-6" />
                <p className="text-muted-foreground">{gig.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bids ({gigBids.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {gigBids.map((bid) => (
                  <BidCard
                    key={bid._id}
                    bid={bid}
                    isOwner={isOwner}
                    onHire={gig.status === "open" ? handleHire : undefined}
                    isHiring={isHiring}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            {isAuthenticated && !isOwner && gig.status === "open" && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasAlreadyBid ? (
                    <p className="text-sm text-muted-foreground text-center">
                      You already submitted a bid.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      <Input
                        type="number"
                        placeholder="Your price"
                        value={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                        required
                      />
                      <Textarea
                        placeholder="Cover letter"
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        required
                      />
                      <Button type="submit" disabled={isSubmitting}>
                        Submit Bid
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
