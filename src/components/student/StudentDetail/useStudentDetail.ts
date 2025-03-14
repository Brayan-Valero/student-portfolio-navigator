
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
      setAvailableTechnologies(FALLBACK_TECHNOLOGIES);
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

  const fetchStudentTechnologies = async (studentCode: string) => {
    try {
      console.log("Fetching student technologies...");
      const techData = await getStudentTechnologies(studentCode);
      console.log("Student technologies received:", techData);
      
      // Map the data to ensure it has consistent properties
      const mappedTechnologies = techData.map((tech: any) => ({
        id: tech.id,
        code: tech.code,
        name: tech.name,
        // Ensure we have a consistent level property
        level: tech.level !== undefined ? tech.level : tech.skill_level
      }));
      
      console.log("Mapped technologies:", mappedTechnologies);
      setTechnologies(mappedTechnologies || []);
    } catch (techError) {
      console.error("Error fetching student technologies:", techError);
      setTechnologies([]);
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
          await fetchStudentTechnologies(code);
          await fetchAvailableTechnologies();
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

    fetchData();
  }, [code]);

  // Refresh technologies after adding/updating/deleting
  const refreshTechnologies = async () => {
    if (code) {
      await fetchStudentTechnologies(code);
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
      
      // Set loading state
      setIsLoadingTechnologies(true);
      
      // Use the level property as is - the API will handle mapping to skill_level
      const payload = {
        code: code,
        name: newTech.name,
        level: newTech.level
      };
      
      console.log("Sending payload to addTechnology:", payload);
      
      const tech = await addTechnology(payload);
      
      if (tech) {
        console.log("Technology added successfully:", tech);
        // Refresh technologies to get the updated list
        await refreshTechnologies();
        toast.success("Technology added successfully");
      }
    } catch (error) {
      console.error("Error adding technology:", error);
      toast.error("Failed to add technology");
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

  const handleUpdateTech = async (id: number, updatedTech: { name: string; level: number }) => {
    if (!updatedTech.name) {
      toast.error("Technology name is required");
      return;
    }

    try {
      setIsLoadingTechnologies(true);
      
      // Send the level property directly - the API will handle mapping to skill_level
      const payload = {
        name: updatedTech.name,
        level: updatedTech.level
      };
      
      console.log("Sending payload to updateTechnology:", payload);
      
      const updated = await updateTechnology(id, payload);
      
      if (updated) {
        // Refresh technologies to get the updated list
        await refreshTechnologies();
        toast.success("Technology updated successfully");
      }
    } catch (error) {
      console.error("Error updating technology:", error);
      toast.error("Failed to update technology");
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

  const handleDeleteTech = async (id: number) => {
    try {
      setIsLoadingTechnologies(true);
      
      const success = await deleteTechnology(id);
      
      if (success) {
        // Refresh technologies to get the updated list
        await refreshTechnologies();
        toast.success("Technology deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting technology:", error);
      toast.error("Failed to delete technology");
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

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
