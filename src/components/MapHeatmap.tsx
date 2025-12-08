import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const categoryColors: Record<string, string> = {
  architect: "blue",
  designer: "purple",
  photographer: "green",
  furnishing: "orange",
};

const MapHeatmap = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  const loadHeatmapData = async (locationQuery: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/map-locations");
      const allPoints = await res.json();

      console.log("Fetched data from backend:", allPoints);

      const heatPoints: [number, number, number][] = allPoints.map((point: any) => [
        point.lat,
        point.lng,
        point.intensity || 0.5,
      ]);

      setHeatmapData(heatPoints);

      toast({
        title: "Heatmap Updated",
        description: `Showing professional density for ${locationQuery}`,
      });

      if (heatLayerRef.current) {
        mapRef.current?.removeLayer(heatLayerRef.current);
      }

      heatLayerRef.current = (L as any).heatLayer(heatPoints, {
        radius: 20,
        blur: 10,
        maxZoom: 17,
        max: 2.5, // normalize intensity
        gradient: {
          0.0: "blue",
          0.4: "green",
          0.7: "orange",
          1.0: "red"
        },
      }).addTo(mapRef.current!);
    } catch (err) {
      console.error("Failed to fetch heatmap data:", err);
      toast({
        title: "Error",
        description: "Failed to fetch map data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("real-map").setView([22.9734, 78.6569], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Please enter a location",
        description: "Enter a pincode or address to view the heatmap",
        variant: "destructive",
      });
      return;
    }

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
    const json = await res.json();
    if (json.length > 0) {
      const lat = parseFloat(json[0].lat);
      const lng = parseFloat(json[0].lon);
      mapRef.current?.setView([lat, lng], 11);
    }

    loadHeatmapData(location);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      <div className="absolute top-24 left-6 z-20 w-80">
        <div className="glass-card space-y-4">
          <h2 className="text-xl font-semibold text-gradient">Location Search</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter pincode or address..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="glass border-0 text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} size="icon" className="micro-interaction">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full h-screen relative z-10">
        <div id="real-map" className="w-full h-full z-10"></div>
      </div>
    </div>
  );
};

export default MapHeatmap;
