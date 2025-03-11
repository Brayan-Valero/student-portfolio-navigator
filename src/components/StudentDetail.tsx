
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  AvailableTechnology
} from "@/services/api";
import StudentHeader from "./student/StudentHeader";
import StudentInfoCard from "./student/StudentInfoCard";
import TechnologiesCard from "./student/TechnologiesCard";

const StudentDetail = () => {
  const { code } = useParams<{ code: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [availableTechnologies, setAvailableTechnologies] = useState<AvailableTechnology[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return;
      
      try {
        setIsLoading(true);
        const studentData = await getStudentByCode(code);
        
        if (studentData) {
          setStudent(studentData);
          const techData = await getStudentTechnologies(code);
          setTechnologies(techData);
          
          const availableTechData = await getAvailableTechnologies();
          setAvailableTechnologies(availableTechData);
        } else {
          toast.error("Student not found");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const handleAddTech = async (newTech: { name: string; level: number }) => {
    if (!newTech.name) {
      toast.error("Please select a technology");
      return;
    }

    try {
      const tech = await addTechnology({
        code: code!,
        name: newTech.name,
        level: newTech.level
      });
      
      if (tech) {
        setTechnologies([...technologies, tech]);
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

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl animate-fade-in">
      <StudentHeader studentCode={student.code} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudentInfoCard student={student} />
        <TechnologiesCard
          technologies={technologies}
          availableTechnologies={availableTechnologies}
          onAddTech={handleAddTech}
          onUpdateTech={handleUpdateTech}
          onDeleteTech={handleDeleteTech}
        />
      </div>
    </div>
  );
};

export default StudentDetail;
