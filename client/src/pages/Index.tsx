import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Users, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: Briefcase,
    title: 'Post & Find Gigs',
    description: 'Create job listings or browse opportunities from clients worldwide.',
  },
  {
    icon: Users,
    title: 'Connect Instantly',
    description: 'Submit bids, review proposals, and hire the perfect freelancer.',
  },
  {
    icon: Shield,
    title: 'Secure Hiring',
    description: 'Transactional integrity ensures fair, race-condition-free hiring.',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Get instant notifications when you\'re hired or receive new bids.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Freelancers' },
  { value: '5K+', label: 'Jobs Posted' },
  { value: '98%', label: 'Success Rate' },
];

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Welcome to the Future of Freelancing
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find Talent. Get Hired.{' '}
              <span className="text-gradient">Grow Together.</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              GigFlow connects skilled freelancers with clients who need their expertise. 
              Post gigs, submit bids, and build your career — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/gigs' : '/register'}>
                <Button variant="hero" size="xl" className="gap-2">
                  {isAuthenticated ? 'Browse Gigs' : 'Get Started Free'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/gigs">
                <Button variant="outline" size="xl">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete platform for freelancers and clients to connect, collaborate, and achieve goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover border-border/50">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How GigFlow Works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Post or Browse', desc: 'Create a gig as a client or browse opportunities as a freelancer.' },
              { step: '2', title: 'Bid & Connect', desc: 'Freelancers submit bids, clients review and choose the best fit.' },
              { step: '3', title: 'Get Hired', desc: 'Secure hiring with instant notifications and automatic bid management.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of freelancers and clients already using GigFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/gigs/new' : '/register'}>
                <Button variant="hero" size="lg" className="gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {isAuthenticated ? 'Post a Gig Now' : 'Create Free Account'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
