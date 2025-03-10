
import { useState, useEffect } from "react";
import { getStudents, Student } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Search, Edit, User, ExternalLink, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ImageWithFallback from "./ImageWithFallback";

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
      setFilteredStudents(data);
      toast.success("Student data loaded successfully");
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load student data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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

  const handleRefreshData = () => {
    setIsRefreshing(true);
    fetchStudents();
  };

  const handleViewResume = (code: string) => {
    navigate(`/resume/${code}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section with the blue arrow pattern */}
      <div className="relative w-full h-[400px] dark-gradient hero-clip-path">
        <div className="absolute top-0 left-0 w-1/2 h-full arrow-pattern z-10"></div>
        <div className="absolute inset-0 bg-black/30 z-20"></div>
        
        <div className="container relative z-30 h-full flex flex-col justify-center px-4 mx-auto max-w-5xl">
          <div className="max-w-2xl animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Student Portfolio Navigator
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Manage and explore student profiles, skills, and achievements in one place
            </p>
            <Button 
              onClick={handleCreateStudent}
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Register New Student
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 mb-8">
          <h2 className="text-2xl font-semibold text-dark-800">
            Student Directory
          </h2>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by name, email or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-[280px]"
              />
            </div>
            
            <Button 
              onClick={handleRefreshData}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto transition-all duration-300 shadow-sm hover:shadow-md"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-1" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-1" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
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
            <h3 className="mt-2 text-lg font-medium text-dark-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search criteria or add a new student.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <Card 
                key={student.code} 
                className="overflow-hidden border border-gray-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1 hover:scale-[1.02] group"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-out forwards'
                }}
              >
                <div className="p-6 flex flex-col items-center text-center relative">
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => handleEditStudent(student.code)}
                    >
                      <Edit size={14} className="text-blue-600" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => handleViewResume(student.code)}
                    >
                      <ExternalLink size={14} className="text-blue-600" />
                    </Button>
                  </div>
                  
                  <div className="h-32 w-32 mb-4 rounded-full border-4 border-white overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-200">
                    <ImageWithFallback
                      src={student.photo}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <h3 className="font-medium text-lg text-dark-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">{student.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-1">{student.email}</p>
                  <p className="text-xs text-gray-400 mb-4">Code: {student.code}</p>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 h-[4.5rem]">
                    {student.description || "No description available."}
                  </p>
                  
                  <Button
                    variant="secondary"
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
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
    </div>
  );
};

export default StudentList;
