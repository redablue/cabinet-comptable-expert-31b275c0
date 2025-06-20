
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, FileText, Calendar, Euro } from "lucide-react";

interface Invoice {
  id: number;
  numero: string;
  client: string;
  dateEmission: string;
  dateEcheance: string;
  montantHT: number;
  montantTTC: number;
  statut: string;
  type: string;
}

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      numero: "FACT-2024-001",
      client: "Société ABC SARL",
      dateEmission: "2024-01-15",
      dateEcheance: "2024-02-15",
      montantHT: 5000,
      montantTTC: 6000,
      statut: "Payée",
      type: "Comptabilité"
    },
    {
      id: 2,
      numero: "FACT-2024-002",
      client: "Boutique Fashion",
      dateEmission: "2024-01-20",
      dateEcheance: "2024-02-20",
      montantHT: 3500,
      montantTTC: 4200,
      statut: "En attente",
      type: "Déclaration TVA"
    }
  ]);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Factures</h2>
          <p className="text-muted-foreground">
            Gérez les factures et la facturation du cabinet
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Factures</p>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Factures Payées</p>
              <p className="text-2xl font-bold">{invoices.filter(f => f.statut === 'Payée').length}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Attente</p>
              <p className="text-2xl font-bold">{invoices.filter(f => f.statut === 'En attente').length}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">CA Total</p>
              <p className="text-2xl font-bold">{invoices.reduce((sum, f) => sum + f.montantTTC, 0).toLocaleString()} MAD</p>
            </div>
            <Euro className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Émission</TableHead>
              <TableHead>Date Échéance</TableHead>
              <TableHead>Montant HT</TableHead>
              <TableHead>Montant TTC</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.numero}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(invoice.dateEmission).toLocaleDateString('fr-FR')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(invoice.dateEcheance).toLocaleDateString('fr-FR')}
                  </div>
                </TableCell>
                <TableCell>{invoice.montantHT.toLocaleString()} MAD</TableCell>
                <TableCell className="font-semibold">{invoice.montantTTC.toLocaleString()} MAD</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.statut)}`}>
                    {invoice.statut}
                  </span>
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
      </Card>
    </div>
  );
}
