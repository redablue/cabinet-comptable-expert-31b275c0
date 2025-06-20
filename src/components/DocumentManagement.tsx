
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, Upload, FileText, Calendar, User } from "lucide-react";

interface Document {
  id: number;
  name: string;
  type: string;
  client: string;
  uploadDate: string;
  uploadedBy: string;
  size: string;
  category: string;
}

export function DocumentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documents] = useState<Document[]>([
    {
      id: 1,
      name: "Déclaration TVA T1 2024.pdf",
      type: "PDF",
      client: "Société ABC SARL",
      uploadDate: "2024-01-15",
      uploadedBy: "Mohamed Alami",
      size: "2.5 MB",
      category: "Déclarations"
    },
    {
      id: 2,
      name: "Bilan 2023.xlsx",
      type: "Excel",
      client: "Boutique Fashion",
      uploadDate: "2024-01-20",
      uploadedBy: "Aicha Benali",
      size: "1.8 MB",
      category: "Bilans"
    },
    {
      id: 3,
      name: "Factures Q4 2023.zip",
      type: "Archive",
      client: "Construction Pro",
      uploadDate: "2024-01-25",
      uploadedBy: "Youssef Tahiri",
      size: "15.2 MB",
      category: "Factures"
    }
  ]);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'Excel': return 'bg-green-100 text-green-800';
      case 'Word': return 'bg-blue-100 text-blue-800';
      case 'Archive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Déclarations': return 'bg-orange-100 text-orange-800';
      case 'Bilans': return 'bg-blue-100 text-blue-800';
      case 'Factures': return 'bg-green-100 text-green-800';
      case 'Contrats': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Documents</h2>
          <p className="text-muted-foreground">
            Gérez et organisez tous vos documents clients
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Télécharger Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Déclarations</p>
              <p className="text-2xl font-bold">{documents.filter(d => d.category === 'Déclarations').length}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bilans</p>
              <p className="text-2xl font-bold">{documents.filter(d => d.category === 'Bilans').length}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Factures</p>
              <p className="text-2xl font-bold">{documents.filter(d => d.category === 'Factures').length}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Date Upload</TableHead>
              <TableHead>Uploadé par</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(document.type)}`}>
                    {document.type}
                  </span>
                </TableCell>
                <TableCell>{document.client}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(document.category)}`}>
                    {document.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {document.uploadedBy}
                  </div>
                </TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
