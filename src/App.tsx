
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/index" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/tasks" element={<Tasks />} />
            
            {/* Add routes for other modules */}
            <Route path="/leads" element={<Dashboard />} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/interns" element={<Dashboard />} />
            <Route path="/attendance" element={<Dashboard />} />
            <Route path="/documents" element={<Dashboard />} />
            <Route path="/finance" element={<Dashboard />} />
            <Route path="/messages" element={<Dashboard />} />
            <Route path="/support" element={<Dashboard />} />
            <Route path="/ticketing" element={<Dashboard />} />
            <Route path="/calendar" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            
            {/* Special routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
