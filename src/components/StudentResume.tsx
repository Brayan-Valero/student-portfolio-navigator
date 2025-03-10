
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Mail, Code, Search } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  getStudentByCode, 
  getStudentTechnologies, 
  Student, 
  Technology 
} from "@/services/api";
import ImageWithFallback from "./ImageWithFallback";
import StarRating from "./StarRating";

const ResumeHeader = () => {
  const [studentCode, setStudentCode] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentCode.trim()) {
      navigate(`/resume/${studentCode}`);
    } else {
      toast.error("Please enter a student code");
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-10 py-3 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Enter student code"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="pl-9 w-[200px] h-9 bg-gray-50 border-gray-200"
            />
          </div>
          <Button 
            type="submit" 
            size="sm"
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            View
          </Button>
        </form>
      </div>
    </div>
  );
};

const StudentResume = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
    
    // Scroll to top when code changes
    window.scrollTo(0, 0);
  }, [code, navigate]);

  if (isLoading) {
    return (
      <>
        <ResumeHeader />
        <div className="container mx-auto max-w-6xl px-4 pt-20 pb-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <ResumeHeader />
        <div className="container mx-auto max-w-6xl px-4 pt-20 pb-12 text-center">
          <Code className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Student Not Found</h2>
          <p className="text-gray-500 mt-2 mb-6">The student you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go to Student List
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <ResumeHeader />
      
      <div 
        ref={contentRef}
        className="container mx-auto max-w-6xl px-4 pt-20 pb-12"
      >
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-blue-800 to-blue-500">
          <div className="absolute inset-0 opacity-10 pattern-dots pattern-dark-800 pattern-size-4"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white overflow-hidden bg-white mb-6 shadow-lg">
              <ImageWithFallback
                src={student.photo}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">{student.name}</h1>
            <div className="flex items-center gap-1 mb-4">
              <Code size={16} className="text-blue-200" />
              <span className="text-blue-100">{student.code}</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {student.email && (
                <a 
                  href={`mailto:${student.email}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-all duration-300"
                >
                  <Mail size={14} />
                  <span>{student.email}</span>
                </a>
              )}
              
              {student.github_link && (
                <a 
                  href={student.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-all duration-300"
                >
                  <Github size={14} />
                  <span>{student.github_link.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* About Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full">
              <div className="p-6 border-b border-gray-100 bg-blue-50">
                <h2 className="text-xl font-semibold text-dark-900">About Me</h2>
              </div>
              
              <div className="p-6">
                {student.description ? (
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {student.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">No description available.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full">
              <div className="p-6 border-b border-gray-100 bg-blue-50">
                <h2 className="text-xl font-semibold text-dark-900">Technical Skills</h2>
              </div>
              
              <div className="p-6">
                {technologies.length === 0 ? (
                  <p className="text-gray-500 italic">No skills listed yet.</p>
                ) : (
                  <div className="space-y-6">
                    {technologies.map((tech, index) => (
                      <div 
                        key={tech.id} 
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-dark-900">{tech.name}</h3>
                          <span className="text-xs text-gray-500">Level {tech.level}/5</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <StarRating value={tech.level} readOnly className="mb-1" />
                          
                          <div className="relative h-2 bg-gray-100 rounded-full flex-1 ml-4 overflow-hidden">
                            <div 
                              className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                              style={{ width: `${(tech.level / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentResume;
