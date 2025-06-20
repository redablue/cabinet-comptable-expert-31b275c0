
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Calendar, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Données d'exemple - à remplacer par des données réelles
const mockTasks = [
  {
    id: "1",
    titre: "Déclaration TVA Client ABC",
    description: "Préparer et soumettre la déclaration TVA pour le client ABC",
    client: "ABC SARL",
    assigneA: "Jean Dupont",
    statut: "En cours",
    priorite: "Haute",
    dateEcheance: "2024-01-15",
    dateCreation: "2024-01-10"
  },
  {
    id: "2",
    titre: "Bilan annuel XYZ",
    description: "Établir le bilan annuel pour XYZ SA",
    client: "XYZ SA",
    assigneA: "Sarah Martin",
    statut: "À faire",
    priorite: "Moyenne",
    dateEcheance: "2024-01-20",
    dateCreation: "2024-01-08"
  }
];

export function TasksManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks] = useState(mockTasks);

  const filteredTasks = tasks.filter(task =>
    task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assigneA.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'À faire': return 'bg-gray-100 text-gray-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-orange-100 text-orange-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Tâches</h2>
          <p className="text-muted-foreground">
            Gérez les tâches et assignations des employés
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Tâche
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.titre}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{task.client}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.assigneA}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(task.statut)}`}>
                      {task.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor(task.priorite)}`}>
                      {task.priorite}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dateEcheance).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune tâche trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
