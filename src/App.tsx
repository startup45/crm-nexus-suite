
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
import Leads from "./pages/Leads";
import Projects from "./pages/Projects";
import Interns from "./pages/Interns";
import Attendance from "./pages/Attendance";
import CalendarPage from "./pages/CalendarPage";
import Documents from "./pages/Documents";
import Finance from "./pages/Finance";
import Messages from "./pages/Messages";
import Support from "./pages/Support";
import Ticketing from "./pages/Ticketing";
import Settings from "./pages/Settings";
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
            <Route path="/leads" element={<Leads />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/interns" element={<Interns />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/support" element={<Support />} />
            <Route path="/ticketing" element={<Ticketing />} />
            <Route path="/settings" element={<Settings />} />
            
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
