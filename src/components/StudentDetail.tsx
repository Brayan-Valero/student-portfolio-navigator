
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Plus, Edit, Trash2, Github, Mail, 
  BookOpen, ExternalLink, Check, X, Save
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  getStudentByCode, 
  getStudentTechnologies, 
  addTechnology, 
  updateTechnology, 
  deleteTechnology, 
  Student, 
  Technology 
} from "@/services/api";
import ImageWithFallback from "./ImageWithFallback";
import StarRating from "./StarRating";

const StudentDetail = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  
  // New technology form
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [newTech, setNewTech] = useState({ name: "", level: 3 });
  
  // Edit technology
  const [editingTechId, setEditingTechId] = useState<number | null>(null);
  const [editTech, setEditTech] = useState({ name: "", level: 1 });

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
        } else {
          toast.error("Student not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [code, navigate]);

  const handleAddTech = async () => {
    if (!newTech.name.trim()) {
      toast.error("Technology name is required");
      return;
    }

    try {
      const tech = await addTechnology({
        student_code: code!,
        name: newTech.name,
        level: newTech.level
      });
      
      if (tech) {
        setTechnologies([...technologies, tech]);
        setNewTech({ name: "", level: 3 });
        setIsAddingTech(false);
        toast.success("Technology added successfully");
      }
    } catch (error) {
      console.error("Error adding technology:", error);
      toast.error("Failed to add technology");
    }
  };

  const startEditingTech = (tech: Technology) => {
    setEditingTechId(tech.id);
    setEditTech({ name: tech.name, level: tech.level });
  };

  const cancelEditingTech = () => {
    setEditingTechId(null);
    setEditTech({ name: "", level: 1 });
  };

  const handleUpdateTech = async (id: number) => {
    if (!editTech.name.trim()) {
      toast.error("Technology name is required");
      return;
    }

    try {
      const updated = await updateTechnology(id, {
        name: editTech.name,
        level: editTech.level
      });
      
      if (updated) {
        setTechnologies(
          technologies.map(tech => tech.id === id ? updated : tech)
        );
        setEditingTechId(null);
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
      <Button
        variant="ghost"
        className="mb-6 gap-2 text-gray-600 hover:text-gray-900"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back to List
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Card */}
        <Card className="border border-gray-100 shadow-sm overflow-hidden lg:col-span-1">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative">
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white shadow-sm"
                onClick={() => navigate(`/edit-student/${student.code}`)}
              >
                <Edit size={14} className="mr-1 text-orange-600" />
                Edit
              </Button>
            </div>
          </div>
          
          <div className="p-6 pt-16 relative">
            <div className="absolute -top-12 left-6">
              <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                <ImageWithFallback
                  src={student.photo}
                  alt={student.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">{student.name}</h1>
            <p className="text-gray-500 mb-4">Student Code: {student.code}</p>
            
            <div className="space-y-4">
              {student.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-orange-500" />
                  <a href={`mailto:${student.email}`} className="hover:text-orange-500">{student.email}</a>
                </div>
              )}
              
              {student.github_link && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Github size={16} className="text-orange-500" />
                  <a href={student.github_link} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 truncate">
                    {student.github_link.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                  </a>
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => navigate(`/resume/${student.code}`)}
                >
                  <BookOpen size={16} />
                  View Resume
                </Button>
              </div>
            </div>
          </div>
          
          {student.description && (
            <>
              <Separator />
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">{student.description}</p>
              </div>
            </>
          )}
        </Card>
        
        {/* Technologies Card */}
        <Card className="border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Technologies</h2>
              <p className="text-gray-500 text-sm">Skills and technologies this student has learned</p>
            </div>
            
            {!isAddingTech && (
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
            {isAddingTech && (
              <div className="bg-orange-50 p-4 rounded-lg mb-6 animate-scale-in">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Technology</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tech-name" className="text-sm text-gray-600">Technology Name</label>
                    <Input
                      id="tech-name"
                      value={newTech.name}
                      onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                      placeholder="e.g. JavaScript, Python, React"
                      className="mt-1 border-gray-200 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Skill Level</label>
                    <StarRating
                      value={newTech.level}
                      onChange={(value) => setNewTech({ ...newTech, level: value })}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200"
                      onClick={() => {
                        setIsAddingTech(false);
                        setNewTech({ name: "", level: 3 });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={handleAddTech}
                    >
                      <Plus size={14} className="mr-1" />
                      Add Technology
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {technologies.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No technologies added</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new technology.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {technologies.map((tech) => (
                  <div 
                    key={tech.id}
                    className="p-4 border border-gray-100 rounded-lg hover:border-orange-200 transition-all duration-300"
                  >
                    {editingTechId === tech.id ? (
                      // Editing mode
                      <div className="space-y-3 animate-scale-in">
                        <Input
                          value={editTech.name}
                          onChange={(e) => setEditTech({ ...editTech, name: e.target.value })}
                          className="border-gray-200 focus:ring-orange-500 focus:border-orange-500"
                        />
                        
                        <div className="flex items-center">
                          <div className="flex-1">
                            <StarRating
                              value={editTech.level}
                              onChange={(value) => setEditTech({ ...editTech, level: value })}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 border-gray-200"
                              onClick={cancelEditingTech}
                            >
                              <X size={14} />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1 bg-orange-500 hover:bg-orange-600 text-white"
                              onClick={() => handleUpdateTech(tech.id)}
                            >
                              <Save size={14} />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Display mode
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
                            onClick={() => startEditingTech(tech)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteTech(tech.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;
