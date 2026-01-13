import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GigCard } from '@/components/gigs/GigCard';
import { useGigs } from '@/context/GigContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Briefcase } from 'lucide-react';

export default function Gigs() {
  const [searchQuery, setSearchQuery] = useState('');
  const { gigs, isLoading } = useGigs();
  const { isAuthenticated } = useAuth();

  const filteredGigs = useMemo(() => {
    if (!searchQuery.trim()) return gigs.filter((g) => g.status === 'open');
    const query = searchQuery.toLowerCase();
    return gigs.filter(
      (gig) =>
        gig.status === 'open' &&
        (gig.title.toLowerCase().includes(query) ||
          gig.description.toLowerCase().includes(query))
    );
  }, [gigs, searchQuery]);

  return (
    <Layout>
      <div className="container py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse Gigs</h1>
            <p className="text-muted-foreground mt-1">
              Find your next opportunity from {gigs.filter((g) => g.status === 'open').length} open gigs
            </p>
          </div>
          
          {isAuthenticated && (
            <Link to="/gigs/new">
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                Post a Gig
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Gigs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No gigs found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Be the first to post a gig!'}
            </p>
            {isAuthenticated && (
              <Link to="/gigs/new">
                <Button variant="hero">Post a Gig</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
