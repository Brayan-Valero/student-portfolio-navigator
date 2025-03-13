
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getStudentByCode,
  getStudentTechnologies,
  getAvailableTechnologies,
  addTechnology,
  updateTechnology,
  deleteTechnology,
  Student,
  Technology,
  AvailableTechnology,
  FALLBACK_TECHNOLOGIES
} from "@/services/api";

export const useStudentDetail = (code: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [availableTechnologies, setAvailableTechnologies] = useState<AvailableTechnology[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableTechnologies = async () => {
    try {
      setIsLoadingTechnologies(true);
      console.log("Fetching available technologies...");
      const availableTechData = await getAvailableTechnologies();
      console.log("Available technologies received:", availableTechData);
      setAvailableTechnologies(availableTechData || FALLBACK_TECHNOLOGIES);
    } catch (error) {
      console.error("Error fetching available technologies:", error);
      // Don't show error toast for expected 404 issues - just use fallback
      setAvailableTechnologies(FALLBACK_TECHNOLOGIES);
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

  const fetchStudentData = async () => {
    if (!code) {
      setError("Student code is missing");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const studentData = await getStudentByCode(code);
      
      if (studentData) {
        setStudent(studentData);
        
        try {
          console.log("Fetching student technologies...");
          const techData = await getStudentTechnologies(code);
          console.log("Student technologies received:", techData);
          setTechnologies(techData || []);
        } catch (techError) {
          console.error("Error fetching student technologies:", techError);
          // Don't show error toast for empty technologies - this is normal for new students
          setTechnologies([]);
        }
        
        // Load available technologies
        fetchAvailableTechnologies();
      } else {
        setError("Student not found");
        toast.error("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
      setError("Failed to load student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTech = async (newTech: { name: string; level: number }) => {
    if (!newTech.name) {
      toast.error("Please select a technology");
      return;
    }

    try {
      console.log("Adding technology:", newTech);
      
      // Validate that code exists before proceeding
      if (!code) {
        toast.error("Student code is missing");
        return;
      }
      
      const tech = await addTechnology({
        code: code,
        name: newTech.name,
        level: newTech.level
      });
      
      if (tech) {
        console.log("Technology added successfully:", tech);
        setTechnologies(prevTechnologies => [...prevTechnologies, tech]);
        toast.success("Technology added successfully");
      }
    } catch (error) {
      console.error("Error adding technology:", error);
      toast.error("Failed to add technology");
    }
  };

  const handleUpdateTech = async (id: number, updatedTech: { name: string; level: number }) => {
    if (!updatedTech.name) {
      toast.error("Technology name is required");
      return;
    }

    try {
      const updated = await updateTechnology(id, {
        name: updatedTech.name,
        level: updatedTech.level
      });
      
      if (updated) {
        setTechnologies(
          technologies.map(tech => tech.id === id ? updated : tech)
        );
        toast.success("Technology updated successfully");
      }
    } catch (error) {
      console.error("Error updating technology:", error);
      toast.error("Failed to update technology");
    }
  };

  const handleDeleteTech = async (id: number) => {
    try {
      const success = await deleteTechnology(id);
      
      if (success) {
        setTechnologies(technologies.filter(tech => tech.id !== id));
        toast.success("Technology deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting technology:", error);
      toast.error("Failed to delete technology");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [code]);

  return {
    isLoading,
    isLoadingTechnologies,
    student,
    technologies,
    availableTechnologies,
    error,
    handleAddTech,
    handleUpdateTech,
    handleDeleteTech
  };
};
