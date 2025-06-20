
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, EyeOff, Copy, Edit, Shield, Key } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ClientIdentifiants {
  id: string;
  nomCommercial: string;
  identifiantDGI: string;
  motDePasseDGI: string;
  identifiantDAMANCOM: string;
  motDePasseDAMANCOM: string;
  statut: string;
}

export function IdentifiantsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<{[key: string]: boolean}>({});
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [clients] = useState<ClientIdentifiants[]>([
    {
      id: "1",
      nomCommercial: "Société ABC SARL",
      identifiantDGI: "DGI123ABC",
      motDePasseDGI: "MotDePasse123!",
      identifiantDAMANCOM: "DAM456DEF",
      motDePasseDAMANCOM: "SecurePass456@",
      statut: "Actif"
    },
    {
      id: "2",
      nomCommercial: "Boutique Fashion",
      identifiantDGI: "DGI789XYZ",
      motDePasseDGI: "Fashion2024#",
      identifiantDAMANCOM: "DAM321GHI",
      motDePasseDAMANCOM: "BoutiqueSecure!",
      statut: "Actif"
    },
    {
      id: "3",
      nomCommercial: "Construction Pro",
      identifiantDGI: "DGI555PRO",
      motDePasseDGI: "Construction@2024",
      identifiantDAMANCOM: "DAM777BUILD",
      motDePasseDAMANCOM: "ProBuild2024$",
      statut: "Actif"
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.nomCommercial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePasswordVisibility = (clientId: string, type: string) => {
    const key = `${clientId}-${type}`;
    setVisiblePasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié!",
        description: `${label} copié dans le presse-papiers`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive",
      });
    }
  };

  const canViewPasswords = userRole === 'superadmin' || userRole === 'admin';

  const renderPasswordField = (clientId: string, password: string, type: string, label: string) => {
    const key = `${clientId}-${type}`;
    const isVisible = visiblePasswords[key];
    
    if (!canViewPasswords) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">••••••••</span>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono min-w-[100px]">
          {isVisible ? password : '••••••••'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePasswordVisibility(clientId, type)}
          className="h-6 w-6 p-0"
        >
          {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
        {isVisible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(password, label)}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Identifiants</h2>
          <p className="text-muted-foreground">
            Gérez les identifiants DGI et DAMANCOM de vos clients
          </p>
        </div>
        {!canViewPasswords && (
          <Badge variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Accès limité
          </Badge>
        )}
      </div>

      {!canViewPasswords && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <Shield className="h-5 w-5" />
            <p className="font-medium">Accès restreint</p>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Seuls les administrateurs peuvent voir les mots de passe complets.
          </p>
        </Card>
      )}

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
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Identifiant DGI</TableHead>
                <TableHead>Mot de passe DGI</TableHead>
                <TableHead>Identifiant DAMANCOM</TableHead>
                <TableHead>Mot de passe DAMANCOM</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.nomCommercial}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(client.statut)}`}>
                      {client.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">{client.identifiantDGI}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(client.identifiantDGI, "Identifiant DGI")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderPasswordField(client.id, client.motDePasseDGI, 'dgi', 'Mot de passe DGI')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">{client.identifiantDAMANCOM}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(client.identifiantDAMANCOM, "Identifiant DAMANCOM")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderPasswordField(client.id, client.motDePasseDAMANCOM, 'damancom', 'Mot de passe DAMANCOM')}
                  </TableCell>
                  <TableCell>
                    {canViewPasswords && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
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
