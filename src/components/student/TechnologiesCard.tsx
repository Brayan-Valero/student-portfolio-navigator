
import { useState } from "react";
import { Technology, AvailableTechnology } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Plus } from "lucide-react";
import TechnologyForm from "./TechnologyForm";
import TechnologyList from "./TechnologyList";

interface TechnologiesCardProps {
  technologies: Technology[];
  availableTechnologies: AvailableTechnology[];
  onAddTech: (tech: { name: string; level: number }) => Promise<void>;
  onUpdateTech: (id: number, tech: { name: string; level: number }) => Promise<void>;
  onDeleteTech: (id: number) => Promise<void>;
  isLoading?: boolean;
}

const TechnologiesCard = ({
  technologies,
  availableTechnologies,
  onAddTech,
  onUpdateTech,
  onDeleteTech,
  isLoading = false
}: TechnologiesCardProps) => {
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [editingTechId, setEditingTechId] = useState<number | null>(null);
  const [currentTech, setCurrentTech] = useState({ name: "", level: 3 });

  const handleAddTech = async () => {
    await onAddTech(currentTech);
    setIsAddingTech(false);
    setCurrentTech({ name: "", level: 3 });
  };

  const handleUpdateTech = async (id: number) => {
    await onUpdateTech(id, currentTech);
    setEditingTechId(null);
    setCurrentTech({ name: "", level: 1 });
  };

  const startEditingTech = (tech: Technology) => {
    setEditingTechId(tech.id);
    setCurrentTech({ name: tech.name, level: tech.level });
  };

  // Make sure technologies is always an array
  const safelyRenderTechnologies = Array.isArray(technologies) ? technologies : [];

  return (
    <Card className="border border-gray-100 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Technologies</h2>
          <p className="text-gray-500 text-sm">Skills and technologies this student has learned</p>
        </div>
        
        {!isAddingTech && !editingTechId && !isLoading && (
          <Button
            variant="outline"
            className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={() => setIsAddingTech(true)}
          >
            <Plus size={16} />
            Add Technology
          </Button>
        )}
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {isAddingTech && (
              <div className="bg-orange-50 p-4 rounded-lg mb-6 animate-scale-in">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Technology</h3>
                <TechnologyForm
                  mode="add"
                  availableTechnologies={availableTechnologies}
                  currentTech={currentTech}
                  onSave={handleAddTech}
                  onCancel={() => {
                    setIsAddingTech(false);
                    setCurrentTech({ name: "", level: 3 });
                  }}
                  onTechChange={setCurrentTech}
                />
              </div>
            )}
            
            {safelyRenderTechnologies.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No technologies added</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new technology.
                </p>
              </div>
            ) : (
              <TechnologyList
                technologies={safelyRenderTechnologies}
                onEdit={startEditingTech}
                onDelete={onDeleteTech}
              />
            )}
            
            {editingTechId !== null && (
              <div className="mt-4 bg-orange-50 p-4 rounded-lg animate-scale-in">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Technology</h3>
                <TechnologyForm
                  mode="edit"
                  availableTechnologies={availableTechnologies}
                  currentTech={currentTech}
                  onSave={() => handleUpdateTech(editingTechId)}
                  onCancel={() => {
                    setEditingTechId(null);
                    setCurrentTech({ name: "", level: 1 });
                  }}
                  onTechChange={setCurrentTech}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default TechnologiesCard;
