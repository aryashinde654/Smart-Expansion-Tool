import Navigation from "@/components/Navigation";
import PersonaGenerator from "@/components/PersonaGenerator";

const Personas = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navigation />
      <PersonaGenerator />
    </div>
  );
};

export default Personas;