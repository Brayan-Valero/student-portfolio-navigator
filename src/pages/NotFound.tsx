
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-9xl font-bold text-orange-500 mb-6">404</h1>
        <p className="text-2xl text-gray-800 mb-6">Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md"
          onClick={() => navigate("/")}
        >
          <Search size={16} className="mr-2" />
          Go to Student List
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
