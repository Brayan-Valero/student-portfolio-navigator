
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, X } from "lucide-react";
import StarRating from "../StarRating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AvailableTechnology, FALLBACK_TECHNOLOGIES } from "@/services/api";
import { toast } from "sonner";

interface TechnologyFormProps {
  mode: "add" | "edit";
  availableTechnologies: AvailableTechnology[];
  currentTech: {
    name: string;
    level: number;
  };
  onSave: () => void;
  onCancel: () => void;
  onTechChange: (tech: { name: string; level: number }) => void;
}

const TechnologyForm = ({ 
  mode, 
  availableTechnologies, 
  currentTech, 
  onSave, 
  onCancel, 
  onTechChange 
}: TechnologyFormProps) => {
  // Use fallback if no technologies are provided
  const technologies = availableTechnologies && availableTechnologies.length > 0 
    ? availableTechnologies 
    : FALLBACK_TECHNOLOGIES;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (mode === "add" && !currentTech.name) {
      toast.error("Please select a technology");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Log current tech before saving
      console.log("Saving technology:", currentTech);
      
      await onSave();
      
      // Show success message
      toast.success(`Technology ${mode === "add" ? "added" : "updated"} successfully`);
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "saving"} technology:`, error);
      toast.error(`Failed to ${mode === "add" ? "add" : "save"} technology`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="tech-select" className="text-sm text-gray-600 block mb-2">Technology</label>
        {mode === "add" ? (
          <Select
            value={currentTech.name}
            onValueChange={(value) => onTechChange({ ...currentTech, name: value })}
          >
            <SelectTrigger id="tech-select" className="w-full border-gray-200 focus:ring-orange-500 focus:border-orange-500">
              <SelectValue placeholder="Select a technology" />
            </SelectTrigger>
            <SelectContent>
              {technologies.map((tech) => (
                <SelectItem key={tech.id} value={tech.name}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={currentTech.name}
            onChange={(e) => onTechChange({ ...currentTech, name: e.target.value })}
            className="border-gray-200 focus:ring-orange-500 focus:border-orange-500"
          />
        )}
      </div>
      
      <div>
        <label className="text-sm text-gray-600 block mb-2">Skill Level</label>
        <StarRating
          value={currentTech.level}
          onChange={(value) => onTechChange({ ...currentTech, level: value })}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-200"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X size={14} className="mr-1" />
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleSave}
          disabled={(mode === "add" && !currentTech.name) || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {mode === "add" ? "Adding..." : "Saving..."}
            </span>
          ) : mode === "add" ? (
            <>
              <Plus size={14} className="mr-1" />
              Add Technology
            </>
          ) : (
            <>
              <Save size={14} className="mr-1" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TechnologyForm;
