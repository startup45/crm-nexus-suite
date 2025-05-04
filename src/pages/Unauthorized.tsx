
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Ban } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md space-y-8 text-center">
        <Ban className="mx-auto h-24 w-24 text-destructive" />
        <h1 className="text-4xl font-extrabold tracking-tight">Unauthorized</h1>
        <p className="text-lg text-muted-foreground">
          You do not have permission to access this page or resource.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
