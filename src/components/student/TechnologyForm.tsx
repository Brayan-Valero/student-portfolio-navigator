
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
import { AvailableTechnology } from "@/services/api";

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
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="tech-select" className="text-sm text-gray-600 block mb-2">Technology</label>
        {mode === "add" ? (
          <Select
            value={currentTech.name}
            onValueChange={(value) => onTechChange({ ...currentTech, name: value })}
          >
            <SelectTrigger className="w-full border-gray-200 focus:ring-orange-500 focus:border-orange-500">
              <SelectValue placeholder="Select a technology" />
            </SelectTrigger>
            <SelectContent>
              {availableTechnologies.length > 0 ? (
                availableTechnologies.map((tech) => (
                  <SelectItem key={tech.id} value={tech.name}>
                    {tech.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading technologies...
                </SelectItem>
              )}
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
        >
          <X size={14} className="mr-1" />
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={onSave}
        >
          {mode === "add" ? (
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
