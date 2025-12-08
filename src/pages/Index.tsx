import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroIcon from "@/components/HeroIcon";
import Navigation from "@/components/Navigation";
import { ArrowRight, MapPin, Users, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-secondary"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Discover
                <span className="text-gradient block">Creative Pros</span>
                Near You
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Map-powered discovery platform connecting you with architects, designers, photographers, 
                and creative professionals through AI-generated insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/map">
                <Button variant="hero" size="hero" className="group">
                  Explore Map
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/personas">
                <Button variant="glass" size="lg" className="hover-lift">
                  Generate AI Personas
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="glass-card text-center space-y-3 hover-lift">
                <div className="w-12 h-12 gradient-primary rounded-xl mx-auto flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Interactive Maps</h3>
                <p className="text-sm text-muted-foreground">Visualize professional density with heatmaps</p>
              </div>
              
              <div className="glass-card text-center space-y-3 hover-lift">
                <div className="w-12 h-12 gradient-primary rounded-xl mx-auto flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">AI Personas</h3>
                <p className="text-sm text-muted-foreground">Get detailed professional profiles</p>
              </div>
              
              <div className="glass-card text-center space-y-3 hover-lift">
                <div className="w-12 h-12 gradient-primary rounded-xl mx-auto flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Real-time Data</h3>
                <p className="text-sm text-muted-foreground">Live insights from multiple sources</p>
              </div>
            </div>
          </div>

          {/* Hero Icon */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <HeroIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
