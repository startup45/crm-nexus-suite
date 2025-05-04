
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard, which will handle auth checks
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to CRM...</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
};

export default Index;
