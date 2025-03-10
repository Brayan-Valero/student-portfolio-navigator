
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  getStudentByCode, 
  createStudent, 
  updateStudent, 
  Student 
} from "@/services/api";

interface StudentFormProps {
  isEditing?: boolean;
}

const StudentForm = ({ isEditing = false }: StudentFormProps) => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState<Student>({
    code: "",
    name: "",
    email: "",
    photo: "",
    github_link: "",
    description: ""
  });

  useEffect(() => {
    const fetchStudent = async () => {
      if (isEditing && code) {
        try {
          setIsLoading(true);
          const data = await getStudentByCode(code);
          if (data) {
            setStudent(data);
          } else {
            toast.error("Student not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching student:", error);
          toast.error("Failed to load student data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStudent();
  }, [code, isEditing, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!student.code || !student.name || !student.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isEditing) {
        await updateStudent(code!, student);
        toast.success("Student updated successfully");
      } else {
        await createStudent(student);
        toast.success("Student created successfully");
      }
      
      navigate("/");
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl animate-fade-in">
      <Button
        variant="ghost"
        className="mb-6 gap-2 text-gray-600 hover:text-gray-900"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back to List
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-blue-50">
          <h1 className="text-2xl font-semibold text-dark-900">
            {isEditing ? "Edit Student" : "Register New Student"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing 
              ? "Update the information for this student" 
              : "Enter details to create a new student profile"
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                Student Code *
              </label>
              <Input
                id="code"
                name="code"
                value={student.code}
                onChange={handleInputChange}
                placeholder="Enter student code"
                required
                disabled={isEditing}
                className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                value={student.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={student.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="photo" className="text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <Input
                id="photo"
                name="photo"
                value={student.photo}
                onChange={handleInputChange}
                placeholder="Enter photo URL"
                className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="github_link" className="text-sm font-medium text-gray-700">
                GitHub URL
              </label>
              <Input
                id="github_link"
                name="github_link"
                value={student.github_link}
                onChange={handleInputChange}
                placeholder="Enter GitHub URL"
                className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={student.description}
              onChange={handleInputChange}
              placeholder="Enter a brief description about the student"
              rows={4}
              className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {isEditing ? "Update Student" : "Save Student"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
