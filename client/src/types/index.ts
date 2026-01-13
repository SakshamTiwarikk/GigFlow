// ================= USER =================
export interface User {
  _id: string;
  name: string;
  email: string;
}

// ================= AUTH =================
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ================= GIG =================
export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: string;
  status: "open" | "assigned";
  createdAt: string;
}

// ================= BID =================
export interface Bid {
  _id: string;
  gigId: string;
  freelancerId: string;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
  createdAt: string;
}
