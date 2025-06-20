
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, UserPlus, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Données d'exemple - à remplacer par des données réelles
const mockEmployees = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@cabinet.ma",
    telephone: "0612345678",
    poste: "Comptable Senior",
    statut: "Actif",
    dateEmbauche: "2023-01-15",
    salaire: 8000
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Sarah",
    email: "sarah.martin@cabinet.ma",
    telephone: "0623456789",
    poste: "Assistant Comptable",
    statut: "Actif",
    dateEmbauche: "2023-06-10",
    salaire: 5500
  }
];

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees] = useState(mockEmployees);

  const filteredEmployees = employees.filter(employee =>
    employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      case 'Congé': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Employés</h2>
          <p className="text-muted-foreground">
            Gérez les employés du cabinet comptable
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nouvel Employé
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
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
                <TableHead>Nom & Prénom</TableHead>
                <TableHead>Contact</TableHead>
                <tablehead>Poste</tablehead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'embauche</TableHead>
                <TableHead>Salaire</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.prenom} {employee.nom}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {employee.telephone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.poste}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(employee.statut)}`}>
                      {employee.statut}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(employee.dateEmbauche).toLocaleDateString()}</TableCell>
                  <TableCell>{employee.salaire.toLocaleString()} MAD</TableCell>
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
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun employé trouvé
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
