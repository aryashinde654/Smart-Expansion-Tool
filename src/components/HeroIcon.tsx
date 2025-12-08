import { MapPin, Zap, Users } from "lucide-react";

const HeroIcon = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Main central icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center glow-effect animate-float">
        <MapPin className="w-10 h-10 text-white" />
      </div>
      
      {/* Orbiting icons */}
      <div className="absolute top-8 right-8 w-12 h-12 glass rounded-xl flex items-center justify-center animate-pulse">
        <Zap className="w-6 h-6 text-primary" />
      </div>
      
      <div className="absolute bottom-8 left-8 w-12 h-12 glass rounded-xl flex items-center justify-center animate-pulse delay-1000">
        <Users className="w-6 h-6 text-accent" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-accent/20 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/3 right-0 w-3 h-3 bg-primary/40 rounded-full animate-ping delay-1000"></div>
    </div>
  );
};

export default HeroIcon;