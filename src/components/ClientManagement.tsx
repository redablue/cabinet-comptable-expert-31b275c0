
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Phone, Mail, Eye, EyeOff } from "lucide-react";

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  status: string;
  dgiLogin: string;
  dgiPassword: string;
  damancomLogin: string;
  damancomPassword: string;
}

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<{[key: string]: boolean}>({});
  const [clients] = useState<Client[]>([
    {
      id: 1,
      name: "Ahmed Benali",
      company: "Société ABC SARL",
      email: "ahmed@abc.ma",
      phone: "0661234567",
      address: "Casablanca, Maroc",
      type: "SARL",
      status: "Actif",
      dgiLogin: "ahmed_abc_2024",
      dgiPassword: "DGI@2024!ABC",
      damancomLogin: "abc_sarl_dm",
      damancomPassword: "Damancom@123"
    },
    {
      id: 2,
      name: "Fatima Alami",
      company: "Boutique Fashion",
      email: "fatima@fashion.ma",
      phone: "0662345678",
      address: "Rabat, Maroc",
      type: "Auto-entrepreneur",
      status: "Actif",
      dgiLogin: "fatima_fashion",
      dgiPassword: "Fashion2024#",
      damancomLogin: "boutique_fm",
      damancomPassword: "DM_Fashion@2024"
    },
    {
      id: 3,
      name: "Mohamed Tahiri",
      company: "Construction Pro",
      email: "mohamed@constructionpro.ma",
      phone: "0663456789",
      address: "Marrakech, Maroc",
      type: "SA",
      status: "En attente",
      dgiLogin: "construc_pro_mt",
      dgiPassword: "ConstrDGI@2024",
      damancomLogin: "construction_dm",
      damancomPassword: "ProConstruct@123"
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePasswordVisibility = (clientId: number, field: string) => {
    const key = `${clientId}-${field}`;
    setVisiblePasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderPasswordField = (clientId: number, password: string, field: string) => {
    const key = `${clientId}-${field}`;
    const isVisible = visiblePasswords[key];
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono">
          {isVisible ? password : '••••••••'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePasswordVisibility(clientId, field)}
          className="h-6 w-6 p-0"
        >
          {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion Clientèle</h2>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Client
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
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
                <TableHead>Nom</TableHead>
                <TableHead>Société</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>DGI</TableHead>
                <TableHead>DAMANCOM</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {client.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.status === 'Actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[150px]">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Login:</div>
                        <div className="text-sm font-mono">{client.dgiLogin}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Mot de passe:</div>
                        {renderPasswordField(client.id, client.dgiPassword, 'dgi')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[150px]">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Login:</div>
                        <div className="text-sm font-mono">{client.damancomLogin}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Mot de passe:</div>
                        {renderPasswordField(client.id, client.damancomPassword, 'damancom')}
                      </div>
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
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
