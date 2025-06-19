
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Calendar, User, Clock } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  client: string;
  dueDate: string;
  priority: string;
  status: string;
}

export function TaskManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Déclaration TVA",
      description: "Préparer et soumettre la déclaration TVA trimestrielle",
      assignee: "Mohamed Alami",
      client: "Société ABC SARL",
      dueDate: "2024-01-15",
      priority: "Urgent",
      status: "En cours"
    },
    {
      id: 2,
      title: "Bilan comptable",
      description: "Établir le bilan comptable annuel",
      assignee: "Aicha Benali",
      client: "Boutique Fashion",
      dueDate: "2024-01-20",
      priority: "Élevée",
      status: "À faire"
    },
    {
      id: 3,
      title: "Révision des comptes",
      description: "Révision des comptes clients et fournisseurs",
      assignee: "Youssef Tahiri",
      client: "Construction Pro",
      dueDate: "2024-01-25",
      priority: "Normale",
      status: "Terminé"
    }
  ]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'Élevée': return 'bg-orange-100 text-orange-800';
      case 'Normale': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'À faire': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Tâches</h2>
          <p className="text-muted-foreground">
            Assignez et suivez les tâches de vos employés
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tâche</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {task.assignee}
                  </div>
                </TableCell>
                <TableCell>{task.client}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
