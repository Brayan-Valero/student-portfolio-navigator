
import { Student } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentHeaderProps {
  studentCode: string;
}

const StudentHeader = ({ studentCode }: StudentHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="mb-6 gap-2 text-gray-600 hover:text-gray-900"
      onClick={() => navigate("/")}
    >
      <ArrowLeft size={16} />
      Back to List
    </Button>
  );
};

export default StudentHeader;
