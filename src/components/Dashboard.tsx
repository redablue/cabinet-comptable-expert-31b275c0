
import { Card } from "@/components/ui/card";
import { Users, FileText, Clock, DollarSign, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatMAD } from "@/utils/currency";

export function Dashboard() {
  const { userRole } = useAuth();
  
  const stats = [
    {
      title: "Clients Actifs",
      value: "127",
      icon: Users,
      color: "bg-blue-500",
      showToAll: true,
    },
    {
      title: "Ventes ce mois",
      value: "45",
      icon: FileText,
      color: "bg-green-500",
      showToAll: true,
    },
    {
      title: "Tâches en cours",
      value: "23",
      icon: Clock,
      color: "bg-orange-500",
      showToAll: true,
    },
    {
      title: "Chiffre d'affaires",
      value: formatMAD(125430),
      icon: DollarSign,
      color: "bg-purple-500",
      showToAll: false, // Seuls responsable/gérant peuvent voir
    },
  ];

  const canViewFinancials = userRole === 'responsable' || userRole === 'gerant';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tableau de Bord</h2>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre station-service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          // Masquer le chiffre d'affaires si l'utilisateur n'a pas les permissions
          if (!stat.showToAll && !canViewFinancials) {
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Accès restreint</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} opacity-50`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          }

          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activités Récentes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span>Nouvelle vente enregistrée - Pompe 1</span>
              <span className="text-sm text-muted-foreground">Il y a 2h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span>Tâche assignée à Mohamed Alami</span>
              <span className="text-sm text-muted-foreground">Il y a 4h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span>Réapprovisionnement carburant</span>
              <span className="text-sm text-muted-foreground">Hier</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tâches Urgentes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
              <span>Maintenance Pompe 3</span>
              <span className="text-sm text-red-600 font-medium">Urgent</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded">
              <span>Vérification stock carburant</span>
              <span className="text-sm text-orange-600 font-medium">3 jours</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
              <span>Rapport mensuel</span>
              <span className="text-sm text-yellow-600 font-medium">1 semaine</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
