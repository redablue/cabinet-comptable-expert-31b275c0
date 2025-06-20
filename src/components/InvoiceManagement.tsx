import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, Eye, DollarSign } from "lucide-react";
import { formatMAD } from "@/utils/currency";

interface Invoice {
  id: number;
  number: string;
  client: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  description: string;
}

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      number: "FACT-2024-001",
      client: "Société ABC SARL",
      date: "2024-01-01",
      dueDate: "2024-01-31",
      amount: 12500,
      status: "Payée",
      description: "Services comptables - Décembre 2023"
    },
    {
      id: 2,
      number: "FACT-2024-002",
      client: "Boutique Fashion",
      date: "2024-01-05",
      dueDate: "2024-02-05",
      amount: 8750,
      status: "En attente",
      description: "Tenue de comptabilité - Janvier 2024"
    },
    {
      id: 3,
      number: "FACT-2024-003",
      client: "Construction Pro",
      date: "2024-01-10",
      dueDate: "2024-02-10",
      amount: 15000,
      status: "Envoyée",
      description: "Bilan comptable et déclarations fiscales"
    }
  ]);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Envoyée': return 'bg-blue-100 text-blue-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'Payée')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion de Facturation</h2>
          <p className="text-muted-foreground">
            Créez et gérez vos factures clients - Conforme à la loi marocaine
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chiffre d'affaires total</p>
              <p className="text-2xl font-bold">{formatMAD(totalAmount)}</p>
              <p className="text-xs text-muted-foreground">TVA 20% incluse</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Montant encaissé</p>
              <p className="text-2xl font-bold">{formatMAD(paidAmount)}</p>
              <p className="text-xs text-muted-foreground">TVA 20% incluse</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{formatMAD(totalAmount - paidAmount)}</p>
              <p className="text-xs text-muted-foreground">TVA 20% incluse</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
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
              <TableHead>N° Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Montant TTC</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{invoice.client}</div>
                    <div className="text-sm text-muted-foreground">{invoice.description}</div>
                  </div>
                </TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="font-medium">{formatMAD(invoice.amount)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
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
