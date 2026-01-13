import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useGigs } from '@/context/GigContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Briefcase, DollarSign, FileText, Send } from 'lucide-react';

export default function CreateGig() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createGig } = useGigs();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      createGig(title, description, parseFloat(budget));
      toast({
        title: 'Gig posted!',
        description: 'Your gig is now live and accepting bids.',
      });
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Post a New Gig</CardTitle>
            <CardDescription>
              Describe your project and set a budget to find the perfect freelancer
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Gig Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Build a React Dashboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Choose a clear, descriptive title for your gig
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you need done, requirements, deliverables, timeline, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about your requirements to attract the right freelancers
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget (USD)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="1000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="1"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Set a realistic budget for your project
                </p>
              </div>
              
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Posting...' : 'Post Gig'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
