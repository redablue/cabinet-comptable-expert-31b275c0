
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

interface EvenementFiscal {
  id: number;
  titre: string;
  date: Date;
  type: "TVA" | "IS" | "IR" | "Declaration";
  description: string;
  urgent: boolean;
}

export function CalendrierFiscal() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const evenementsFiscaux: EvenementFiscal[] = [
    {
      id: 1,
      titre: "Déclaration TVA mensuelle",
      date: new Date(2024, 11, 20), // 20 décembre 2024
      type: "TVA",
      description: "Déclaration et paiement de la TVA du mois de novembre",
      urgent: true
    },
    {
      id: 2,
      titre: "Acompte IS 4ème trimestre",
      date: new Date(2024, 11, 31), // 31 décembre 2024
      type: "IS",
      description: "Paiement du 4ème acompte provisionnel IS",
      urgent: false
    },
    {
      id: 3,
      titre: "Déclaration annuelle IR",
      date: new Date(2025, 2, 31), // 31 mars 2025
      type: "IR",
      description: "Déclaration annuelle des revenus",
      urgent: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TVA": return "bg-blue-100 text-blue-800";
      case "IS": return "bg-green-100 text-green-800";
      case "IR": return "bg-purple-100 text-purple-800";
      case "Declaration": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const evenementsProches = evenementsFiscaux
    .filter(evt => evt.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Calendrier Fiscal</h2>
          <p className="text-muted-foreground">
            Gérez les échéances fiscales et obligations déclaratives
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Échéance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendrier
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Échéances Prochaines
          </h3>
          <div className="space-y-3">
            {evenementsProches.map((evenement) => (
              <div key={evenement.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{evenement.titre}</h4>
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(evenement.type)}>
                      {evenement.type}
                    </Badge>
                    {evenement.urgent && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {evenement.description}
                </p>
                <p className="text-sm font-medium">
                  Échéance: {evenement.date.toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rappels Automatiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-sm text-blue-800">Échéances ce mois</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-2">2</div>
            <div className="text-sm text-red-800">Échéances urgentes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">8</div>
            <div className="text-sm text-green-800">Échéances traitées</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
