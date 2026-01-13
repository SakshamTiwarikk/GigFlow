import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "@/services/api";
import { Bid } from "@/types";
import { useAuth } from "./AuthContext";

interface BidContextType {
  bids: Record<string, Bid[]>;
  myBids: Bid[];
  isLoading: boolean;
  submitBid: (gigId: string, message: string, price: number) => Promise<void>;
  fetchBidsForGig: (gigId: string) => Promise<void>;
  hireBid: (bidId: string) => Promise<void>;
}

const BidContext = createContext<BidContextType | undefined>(undefined);

export function BidProvider({ children }: { children: ReactNode }) {
  const [bids, setBids] = useState<Record<string, Bid[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // 📝 Submit bid (freelancer)
  const submitBid = async (
    gigId: string,
    message: string,
    price: number
  ) => {
    await api.post("/bids", {
      gigId,
      message,
      price,
    });
  };

  // 📥 Fetch bids for a gig (client only)
  const fetchBidsForGig = async (gigId: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/bids/${gigId}`);
      setBids((prev) => ({
        ...prev,
        [gigId]: res.data,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Hire freelancer (atomic backend logic)
  const hireBid = async (bidId: string) => {
    await api.patch(`/bids/${bidId}/hire`);
  };

  // 👤 Bids submitted by logged-in freelancer
  const myBids = Object.values(bids)
    .flat()
    .filter((bid) => bid.freelancerId === user?._id);

  return (
    <BidContext.Provider
      value={{
        bids,
        myBids,
        isLoading,
        submitBid,
        fetchBidsForGig,
        hireBid,
      }}
    >
      {children}
    </BidContext.Provider>
  );
}

export function useBids() {
  const context = useContext(BidContext);
  if (!context) {
    throw new Error("useBids must be used within a BidProvider");
  }
  return context;
}
