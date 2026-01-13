import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/services/api";
import { Gig } from "@/types";
import { useAuth } from "./AuthContext";

interface GigContextType {
  gigs: Gig[];
  myGigs: Gig[];
  isLoading: boolean;
  fetchGigs: () => Promise<void>;
  createGig: (
    title: string,
    description: string,
    budget: number
  ) => Promise<void>;
  getGigById: (id: string) => Gig | undefined;
}

const GigContext = createContext<GigContextType | undefined>(undefined);

export function GigProvider({ children }: { children: ReactNode }) {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // 📥 Fetch all gigs (global)
  const fetchGigs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/gigs");
      setGigs(res.data);
    } catch (error) {
      console.error("Failed to fetch gigs", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Create gig (client only)
  const createGig = async (
    title: string,
    description: string,
    budget: number
  ) => {
    await api.post("/gigs", {
      title,
      description,
      budget,
    });
    await fetchGigs();
  };

  // 🔍 Get gig by MongoDB _id
  const getGigById = (id: string) => {
    return gigs.find((gig) => gig._id === id);
  };

  // 👤 Gigs posted by logged-in user
  const myGigs = gigs.filter((gig) => gig.ownerId === user?._id);

  // 🔁 Load gigs once on app start
  useEffect(() => {
    fetchGigs();
  }, []);

  return (
    <GigContext.Provider
      value={{
        gigs,
        myGigs,
        isLoading,
        fetchGigs,
        createGig,
        getGigById,
      }}
    >
      {children}
    </GigContext.Provider>
  );
}

export function useGigs() {
  const context = useContext(GigContext);
  if (!context) {
    throw new Error("useGigs must be used within GigProvider");
  }
  return context;
}
