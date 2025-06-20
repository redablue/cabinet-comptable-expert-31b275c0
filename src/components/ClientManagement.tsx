
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash2, Phone, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { ClientDialog } from "@/components/ClientDialog";
import { useClients } from "@/hooks/useClients";
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<{[key: string]: boolean}>({});
  
  const { 
    clients, 
    isLoading, 
    createClient, 
    updateClient, 
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting
  } = useClients();

  const filteredClients = clients.filter(client =>
    client.nom_commercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.raison_sociale && client.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const togglePasswordVisibility = (clientId: string, field: string) => {
    const key = `${clientId}-${field}`;
    setVisiblePasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderPasswordField = (clientId: string, password: string | null, field: string) => {
    if (!password) return <span className="text-sm text-muted-foreground">-</span>;
    
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'SARL': return 'bg-blue-100 text-blue-800';
      case 'SA': return 'bg-purple-100 text-purple-800';
      case 'Auto-entrepreneur': return 'bg-orange-100 text-orange-800';
      case 'Particulier': return 'bg-green-100 text-green-800';
      case 'Association': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion Clientèle</h2>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <ClientDialog onSubmit={createClient} isLoading={isCreating} />
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
                <TableHead>Nom Commercial</TableHead>
                <TableHead>Raison Sociale</TableHead>
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
                  <TableCell className="font-medium">{client.nom_commercial}</TableCell>
                  <TableCell>{client.raison_sociale || '-'}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      )}
                      {client.telephone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {client.telephone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadgeColor(client.type_client)}`}>
                      {client.type_client}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(client.statut)}`}>
                      {client.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[150px]">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Login:</div>
                        <div className="text-sm font-mono">{client.identifiant_dgi || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Mot de passe:</div>
                        {renderPasswordField(client.id, client.mot_de_passe_dgi, 'dgi')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[150px]">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Login:</div>
                        <div className="text-sm font-mono">{client.identifiant_damancom || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Mot de passe:</div>
                        {renderPasswordField(client.id, client.mot_de_passe_damancom, 'damancom')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ClientDialog 
                        client={client} 
                        onSubmit={updateClient} 
                        isLoading={isUpdating}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteClient(client.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Aucun client trouvé
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
