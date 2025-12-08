import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Map } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: MapPin },
    { path: "/map", label: "Map", icon: Map },
    { path: "/personas", label: "Personas", icon: Users },
  ];

  return (
    <nav className="glass-card fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-2">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 mr-4">
          <div className="w-10 h-8 gradient-primary rounded-lg flex items-center justify-center glow-effect">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gradient">Stashlers</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="micro-interaction flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;