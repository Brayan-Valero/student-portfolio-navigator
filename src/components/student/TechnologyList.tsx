
import { Technology } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import StarRating from "../StarRating";

interface TechnologyListProps {
  technologies: Technology[];
  onEdit: (tech: Technology) => void;
  onDelete: (id: number) => void;
}

const TechnologyList = ({ technologies, onEdit, onDelete }: TechnologyListProps) => {
  console.log("TechnologyList rendering with technologies:", technologies);
  
  // Check if technologies is undefined or null and return appropriate UI
  if (!technologies || !Array.isArray(technologies)) {
    console.error("TechnologyList received invalid technologies:", technologies);
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Unable to load technologies</p>
      </div>
    );
  }
  
  // Check if the technologies array is empty
  if (technologies.length === 0) {
    console.log("TechnologyList received empty technologies array");
    return null;
  }
  
  return (
    <div className="space-y-4">
      {technologies.map((tech) => {
        console.log("Rendering technology:", tech);
        return (
          <div 
            key={tech.id}
            className="p-4 border border-gray-100 rounded-lg hover:border-orange-200 transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{tech.name}</h3>
                <div className="mt-1">
                  <StarRating value={tech.level} readOnly />
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                  onClick={() => onEdit(tech)}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                  onClick={() => onDelete(tech.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechnologyList;
