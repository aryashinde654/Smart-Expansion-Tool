import Navigation from "@/components/Navigation";
import MapHeatmap from "@/components/MapHeatmap";
import React from 'react';


const Map = () => {
  return (
    <div className="relative">
      <Navigation />
      <MapHeatmap />
    </div>
  );
};

export default Map;