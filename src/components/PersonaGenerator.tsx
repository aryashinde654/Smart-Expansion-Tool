import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User, Camera, Palette, Home, Star, MessageCircle, Filter, X, Mail, Phone, Globe, Send, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


interface Persona {
  id: string;
  name: string;
  type: "architect" | "designer" | "photographer" | "influencer" | "furnishing";
  rating: number;
  location: string;
  contact: string;
  reviews: number;
  portfolio?: string;
  image?: string;
}

const PersonaGenerator = () => {
  const { toast } = useToast();
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const generatePersonas = async () => {
  if (!pincode.trim()) {
    toast({
      title: "Please enter a pincode",
      description: "Enter a valid pincode to generate AI persona",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    // ✅ Use 'postalCode' instead of 'pincode'
    const res = await fetch(`http://127.0.0.1:8000/personas?postalCode=${pincode}`);
    const data = await res.json();

    if (!data.length) {
      toast({
        title: "No professionals found",
        description: "Try a different pincode",
        variant: "destructive",
      });
    } else {
    const mappedPersonas = data.map((item: any, index: number) => ({
      id: item.id || index.toString(),
      name: item.name || item.title || "Unknown",
      type: item.type || (item.categoryName || "").toLowerCase(),
      rating: item.rating ?? item.totalScore ?? 0,
      location: item.location || item.address || "",
      contact: item.contact || item.phone || "",
      reviews: item.reviews ?? 0,
      postalCode: item.postalCode || item.postalCode || "",
      // ← NEW: normalize portfolio field (use url or website if portfolio is missing)
      portfolio: item.portfolio || item.url || item.website || "",
      // ← optional image if you stored it in DB (fallback blank)
      image: item.image || item.photoUrl || "",
    }));


      setPersonas(mappedPersonas);

      toast({
        title: "Personas Generated!",
        description: `Found ${mappedPersonas.length} professionals in your area`,
      });
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "Error fetching data",
      description: "Please try again later",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


const scrapeNew = async () => {
  if (!pincode.trim()) {
    toast({
      title: "Please enter a pincode",
      description: "Enter a valid pincode to scrape data",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Scraping Started!",
    description: "Fetching latest professional data...",
  });

  try {
    const res = await fetch(`http://127.0.0.1:8000/scrape?postalCode=${pincode}`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.error) {
      toast({
        title: "Scraping Failed",
        description: data.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Scraping Completed",
        description: "New data has been added to the database. Refresh to see updated personas.",
      });
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to run scraper. Try again later.",
      variant: "destructive",
    });
  }
};

// 🧠 Normalize similar category names for consistent filtering
const normalizeType = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("architect")) return "architect";
  if (t.includes("design")) return "designer";
  if (t.includes("photo")) return "photographer";
  if (t.includes("influencer")) return "influencer";
  if (t.includes("furnish") || t.includes("decor")) return "furnishing";
  return "other";
};

// 🧩 Apply normalized filtering
const filteredPersonas = personas.filter(p => {
  const normalizedType = normalizeType(p.type);
  const typeMatch = selectedFilter === "all" || normalizedType === selectedFilter;
  const ratingMatch = selectedRating === 0 || p.rating >= selectedRating;
  return typeMatch && ratingMatch;
});


  const filterOptions = [
    { value: "all", label: "All Professionals", icon: <Star className="w-4 h-4" /> },
    { value: "architect", label: "Architects", icon: <User className="w-4 h-4" /> },
    { value: "designer", label: "Designers", icon: <Palette className="w-4 h-4" /> },
    { value: "photographer", label: "Photographers", icon: <Camera className="w-4 h-4" /> },
    
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "architect": return <User className="w-5 h-5" />;
      case "designer": return <Palette className="w-5 h-5" />;
      case "photographer": return <Camera className="w-5 h-5" />;
      case "influencer": return <Star className="w-5 h-5" />;
      case "furnishing": return <Home className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "architect": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "designer": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "photographer": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "influencer": return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      case "furnishing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-4">Personas Generator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover top professionals in your area with AI-powered insights
          </p>
        </div>

        {/* Scrape New Button - Top Right */}
        <div className="fixed top-6 right-6 z-10">
          <Button 
            onClick={scrapeNew}
            variant="glass"
            className="micro-interaction"
          >
            Scrape New
          </Button>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-12">
          <div className="glass-card space-y-4">
            <h2 className="text-lg font-semibold">Enter Location</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter pincode..."
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="glass border-0"
                onKeyPress={(e) => e.key === 'Enter' && generatePersonas()}
              />
              <Button 
                onClick={generatePersonas} 
                disabled={isLoading}
                className="micro-interaction"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        {personas.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Filter Professionals</h3>
              <div>
                <h4 className="text-sm font-medium mb-2">By Type & Rating</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedFilter === option.value ? "default" : "outline"}
                      onClick={() => setSelectedFilter(option.value)}
                      className="micro-interaction"
                    >
                      {option.icon}
                      {option.label}
                    </Button>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={selectedRating > 0 ? "default" : "outline"}
                        className="micro-interaction"
                      >
                        <Star className="w-4 h-4" />
                        {selectedRating === 0 ? "All Ratings" : `${selectedRating}+ Stars`}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-card border-0">
                      {[0, 4, 4.5, 4.7, 4.8].map((rating) => (
                        <DropdownMenuItem
                          key={rating}
                          onClick={() => setSelectedRating(rating)}
                          className="cursor-pointer"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Map Section */}
      {/* Map Section (Pins Only, No Heatmap) */}
{personas.length > 0 && (
  <div className="mb-8 animate-fade-in">
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-4">Location Map</h3>
      <div className="h-96 rounded-lg overflow-hidden">
        {/* Import needed for react-leaflet */}
        <MapContainer
          center={[20.5937, 78.9629]} // Default India
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Add pins for each persona */}
          {filteredPersonas.map((persona) =>
            persona.lat && persona.lng ? (
              <Marker
                key={persona.id}
                position={[persona.lat, persona.lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedPersona(persona);
                    setShowProfileModal(true);
                  },
                }}
              >
                <Popup>
                  <strong>{persona.name}</strong>
                  <br />
                  {persona.type}
                  <br />
                  {persona.location}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  </div>
)}



        {/* Filtered Personas Grid */}
        {filteredPersonas.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedFilter === "all" 
                  ? "All Professionals" 
                  : `${selectedFilter === 'furnishing' ? 'Furnishing Shops' : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1) + 's'}`
                }
              </h2>
              <Badge variant="outline" className="glass">
                {filteredPersonas.length} found
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersonas.map((persona, index) => (
                <Card key={persona.id} className="glass-card hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(persona.type)}`}>
                        {getIcon(persona.type)}
                      </div>

                        <h3 className="font-semibold text-lg">{persona.name}</h3>
                        <Badge className={`${getTypeColor(persona.type)} capitalize`}>
                          {persona.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{persona.rating}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{persona.location}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reviews:</span>
                      <span>{persona.reviews}</span>
                    </div>

                    <div className="pt-3 border-t border-border/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="text-primary">{persona.contact}</span>
                      </div>

                      {persona.portfolio ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Portfolio:</span>
                          <a
                            href={persona.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary truncate max-w-[10rem] block"
                          >
                            {persona.portfolio}
                          </a>
                        </div>
                      ) : null}
                    </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4 micro-interaction"
                    onClick={() => {
                      setSelectedPersona(persona);
                      setShowProfileModal(true);
                    }}
                  >
                    View Profile
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {personas.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="glass-card p-12 max-w-md mx-auto">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No personas generated yet</h3>
              <p className="text-muted-foreground">Enter a pincode to discover professionals in your area</p>
            </div>
          </div>
        )}

        {/* Profile Modal */}
<Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
    {selectedPersona && (
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
          <div className="text-center">
            {/* Image will go here later */}
            <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-200">
              {/* Placeholder until we add actual img */}
            </div>
            <h3 className="text-xl font-bold">{selectedPersona.name}</h3>
            <Badge className={`${getTypeColor(selectedPersona.type)} mt-2 capitalize`}>
              {selectedPersona.type}
            </Badge>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="w-full md:w-2/3 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Professional Profile</h2>
          </div>

          <div className="space-y-6">
            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-semibold">{selectedPersona.rating}</span>
              </div>
              <span className="text-muted-foreground">({selectedPersona.reviews} reviews)</span>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Location</h4>
              <p className="text-lg">{selectedPersona.location}</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Contact Information</h4>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{selectedPersona.contact}</span>
              </div>
             {selectedPersona.portfolio ? (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={selectedPersona.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Website
                </a>
              </div>
            ) : null}

            </div>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed bottom-24 right-6 z-50 w-80 h-96 glass-card animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="font-semibold">Chat Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatbot(false)}
              >
                ×
              </Button>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-4">
                <p className="text-muted-foreground text-sm">
                  Hello! I'm here to help you find the perfect professionals for your needs. 
                  Ask me anything about our services!
                </p>
              </div>
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="glass border-0 flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatMessage.trim()) {
                        // Handle send message
                        setChatMessage("");
                      }
                    }}
                  />
                  <Button 
                    size="icon"
                    onClick={() => {
                      if (chatMessage.trim()) {
                        // Handle send message
                        setChatMessage("");
                      }
                    }}
                    disabled={!chatMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaGenerator;