
import { Users, Calendar, FileText, BarChart3, MapPin, Settings, CalendarDays, UserCheck, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    title: "Tableau de bord",
    id: "dashboard",
    icon: BarChart3,
    roles: ['superadmin', 'admin', 'comptable', 'assistant'],
  },
  {
    title: "Gestion Clientèle",
    id: "clients",
    icon: Users,
    roles: ['superadmin', 'admin', 'comptable', 'assistant'],
  },
  {
    title: "Tâches Employés",
    id: "tasks",
    icon: Calendar,
    roles: ['superadmin', 'admin', 'comptable'],
  },
  {
    title: "Facturation",
    id: "invoices",
    icon: FileText,
    roles: ['superadmin', 'admin', 'comptable'],
  },
  {
    title: "Calendrier Fiscal",
    id: "calendrier-fiscal",
    icon: CalendarDays,
    roles: ['superadmin', 'admin', 'comptable'],
  },
  {
    title: "Gestion Utilisateurs",
    id: "users",
    icon: UserCheck,
    roles: ['superadmin', 'admin'],
  },
  {
    title: "Paramètres",
    id: "parametres",
    icon: Settings,
    roles: ['superadmin', 'admin'],
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const { userRole, signOut, user } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'comptable': return 'bg-green-100 text-green-800';
      case 'assistant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-bold text-lg">Cabinet Comptable</h2>
            <p className="text-sm text-muted-foreground">Maroc</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{user?.email}</p>
            </div>
            <Badge className={getRoleBadgeColor(userRole || '')}>
              {userRole}
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full gap-2"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
