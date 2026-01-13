import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GigCard } from "@/components/gigs/GigCard";
import { useGigs } from "@/context/GigContext";
import { useBids } from "@/context/BidContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  FileText,
  Plus,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { myGigs, isLoading: gigsLoading } = useGigs();
  const { myBids, isLoading: bidsLoading } = useBids();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const openGigs = myGigs.filter((g) => g.status === "open");
  const assignedGigs = myGigs.filter((g) => g.status === "assigned");

  const pendingBids = myBids.filter((b) => b.status === "pending");
  const hiredBids = myBids.filter((b) => b.status === "hired");
  const rejectedBids = myBids.filter((b) => b.status === "rejected");

  const statusColors = {
    pending: "bg-warning/10 text-warning border-warning/20",
    hired: "bg-success/10 text-success border-success/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusIcons = {
    pending: Clock,
    hired: CheckCircle2,
    rejected: XCircle,
  };

  return (
    <Layout>
      <div className="container py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Manage your gigs and bids.
            </p>
          </div>

          <Link to="/gigs/new">
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Post a Gig
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myGigs.length}</p>
                  <p className="text-xs text-muted-foreground">Gigs Posted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assignedGigs.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Completed Hires
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myBids.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Bids Submitted
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hiredBids.length}</p>
                  <p className="text-xs text-muted-foreground">Jobs Won</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-gigs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-gigs" className="gap-2">
              <Briefcase className="h-4 w-4" />
              My Gigs ({myGigs.length})
            </TabsTrigger>
            <TabsTrigger value="my-bids" className="gap-2">
              <FileText className="h-4 w-4" />
              My Bids ({myBids.length})
            </TabsTrigger>
          </TabsList>

          {/* My Gigs Tab */}
          <TabsContent value="my-gigs">
            {gigsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : myGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGigs.map((gig) => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No gigs posted yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Post your first gig to start receiving bids from freelancers
                  </p>
                  <Link to="/gigs/new">
                    <Button variant="hero">Post a Gig</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="my-bids">
            {bidsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : myBids.length > 0 ? (
              <div className="space-y-4">
                {myBids.map((bid) => {
                  const StatusIcon = statusIcons[bid.status];
                  return (
                    <Card
                      key={bid._id}
                      className={`transition-all ${
                        bid.status === "hired" ? "ring-2 ring-success/50" : ""
                      }`}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                bid.status === "hired"
                                  ? "bg-success/10"
                                  : bid.status === "rejected"
                                  ? "bg-destructive/10"
                                  : "bg-warning/10"
                              }`}
                            >
                              <StatusIcon
                                className={`h-5 w-5 ${
                                  bid.status === "hired"
                                    ? "text-success"
                                    : bid.status === "rejected"
                                    ? "text-destructive"
                                    : "text-warning"
                                }`}
                              />
                            </div>
                            <div>
                              <Link to={`/gigs/${bid.gigId}`}>
                                <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                                  View Gig Details
                                </h4>
                              </Link>

                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {bid.message}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-primary">
                                ${bid.price.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(bid.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={statusColors[bid.status]}
                            >
                              {bid.status.charAt(0).toUpperCase() +
                                bid.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No bids submitted yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Browse open gigs and submit your first bid
                  </p>
                  <Link to="/gigs">
                    <Button variant="hero">Browse Gigs</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
