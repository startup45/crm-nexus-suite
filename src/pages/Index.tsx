
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDefaultAdminIfNotExists } from "@/lib/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const navigate = useNavigate();
  const [adminCreated, setAdminCreated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        // Create default admin if it doesn't exist
        const result = await createDefaultAdminIfNotExists();
        setAdminCreated(result);
      } catch (error) {
        console.error("Error setting up admin:", error);
        setAdminCreated(false);
      } finally {
        setIsLoading(false);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    setupAdmin();
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">CRM Nexus Suite</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Initializing system...</p>
          </div>
        ) : (
          <>
            {adminCreated === true && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Default admin account is ready.
                  <div className="mt-2 text-sm">
                    <strong>Email:</strong> admin@crmnexus.com<br />
                    <strong>Password:</strong> Admin123!
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {adminCreated === false && (
              <Alert variant="destructive">
                <AlertDescription>
                  There was an issue setting up the default admin account.
                  Please check console for details.
                </AlertDescription>
              </Alert>
            )}
            
            <p className="text-muted-foreground mt-4">
              Redirecting to login page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;

