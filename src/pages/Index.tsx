
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { ClientManagement } from "@/components/ClientManagement";
import { TaskManagement } from "@/components/TaskManagement";
import { InvoiceManagement } from "@/components/InvoiceManagement";
import { CalendrierFiscal } from "@/components/CalendrierFiscal";
import { Parametres } from "@/components/Parametres";
import { UserManagement } from "@/components/UserManagement";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { userRole } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientManagement />;
      case "tasks":
        return <TaskManagement />;
      case "invoices":
        return <InvoiceManagement />;
      case "calendrier-fiscal":
        return <CalendrierFiscal />;
      case "users":
        return <UserManagement />;
      case "parametres":
        return <Parametres />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-white p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Système de Gestion - Cabinet Comptable Maroc
                </span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
