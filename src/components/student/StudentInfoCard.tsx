
import { Student } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Edit, Github, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from "../ImageWithFallback";

interface StudentInfoCardProps {
  student: Student;
}

const StudentInfoCard = ({ student }: StudentInfoCardProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default StudentInfoCard;
