
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after a short delay
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">CRM Nexus Suite</h1>
        
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Welcome to CRM Nexus Suite - Demo Version
            <div className="mt-2 text-sm">
              This is a demo version without authentication or Firebase.
              All features are simulated with local storage.
            </div>
          </AlertDescription>
        </Alert>
        
        <p className="text-muted-foreground mt-4">
          Redirecting to login page...
        </p>
      </div>
    </div>
  );
};

export default Index;
