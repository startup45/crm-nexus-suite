
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { bypassAuth } = useAuth();

  useEffect(() => {
    // Redirect to login after a short delay, unless bypass is enabled
    const timeout = setTimeout(() => {
      navigate(bypassAuth ? "/" : "/login");
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate, bypassAuth]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">CRM Nexus Suite</h1>
        
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Welcome to CRM Nexus Suite - Demo Version
            <div className="mt-2 text-sm">
              {bypassAuth 
                ? "Authentication bypass is enabled. You can access all features without logging in."
                : "This is a demo version. Please log in to continue."
              }
            </div>
          </AlertDescription>
        </Alert>
        
        <p className="text-muted-foreground mt-4">
          Redirecting to {bypassAuth ? "dashboard" : "login"} page...
        </p>
      </div>
    </div>
  );
};

export default Index;
