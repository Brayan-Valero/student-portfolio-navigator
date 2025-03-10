
import { useState, useEffect } from "react";
import { getStudents, Student } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Search, Edit, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ImageWithFallback from "./ImageWithFallback";

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await getStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load student data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleViewStudent = (code: string) => {
    navigate(`/student/${code}`);
  };

  const handleEditStudent = (code: string) => {
    navigate(`/edit-student/${code}`);
  };

  const handleCreateStudent = () => {
    navigate("/create-student");
  };

  const handleViewResume = (code: string) => {
    navigate(`/resume/${code}`);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl animate-fade-in">
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 mb-8">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Student Portfolio Navigator</h1>
          <p className="text-gray-500 mt-1">Manage and explore student profiles and skills</p>
        </div>
        <Button 
          onClick={handleCreateStudent}
          className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Register New Student
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search by name, email or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-gray-200 shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden h-[280px] skeleton animate-pulse"></Card>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your search criteria or add a new student.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <Card 
              key={student.code} 
              className="overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
                animation: 'fadeIn 0.5s ease-out forwards'
              }}
            >
              <div 
                className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative"
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{ opacity: 0.2 }}
                >
                  <div className="w-full h-full bg-pattern opacity-30"></div>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                    onClick={() => handleEditStudent(student.code)}
                  >
                    <Edit size={14} className="text-orange-600" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                    onClick={() => handleViewResume(student.code)}
                  >
                    <ExternalLink size={14} className="text-orange-600" />
                  </Button>
                </div>
                <div className="absolute -bottom-12 left-4">
                  <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                    <ImageWithFallback
                      src={student.photo}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-5 pt-16">
                <h3 className="font-medium text-lg text-gray-900 mb-1 line-clamp-1">{student.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{student.email}</p>
                <p className="text-xs text-gray-400 mb-4">Code: {student.code}</p>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 h-[4.5rem]">
                  {student.description || "No description available."}
                </p>
                
                <Button
                  variant="secondary"
                  className="w-full bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100"
                  onClick={() => handleViewStudent(student.code)}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;
