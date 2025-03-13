
import { useParams } from "react-router-dom";
import StudentHeader from "../StudentHeader";
import StudentInfoCard from "../StudentInfoCard";
import TechnologiesCard from "../TechnologiesCard";
import StudentDetailLoading from "./StudentDetailLoading";
import StudentDetailError from "./StudentDetailError";
import StudentNotFound from "./StudentNotFound";
import { useStudentDetail } from "./useStudentDetail";

const StudentDetail = () => {
  const { code } = useParams<{ code: string }>();
  const {
    isLoading,
    isLoadingTechnologies,
    student,
    technologies,
    availableTechnologies,
    error,
    handleAddTech,
    handleUpdateTech,
    handleDeleteTech
  } = useStudentDetail(code);

  if (isLoading) {
    return <StudentDetailLoading />;
  }

  if (error) {
    return <StudentDetailError error={error} />;
  }

  if (!student) {
    return <StudentNotFound />;
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
          isLoading={isLoadingTechnologies}
        />
      </div>
    </div>
  );
};

export default StudentDetail;
