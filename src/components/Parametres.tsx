
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Building, Users, Bell, Shield, Save } from "lucide-react";

export function Parametres() {
  const [cabinetInfo, setCabinetInfo] = useState({
    nom: "Cabinet Comptable Maroc",
    adresse: "Casablanca, Maroc",
    telephone: "+212 5 22 00 00 00",
    email: "contact@cabinet.ma",
    rc: "123456",
    patente: "789012",
    ice: "001234567890123"
  });

  const [notifications, setNotifications] = useState({
    emailEcheances: true,
    emailFactures: true,
    smsUrgent: false,
    rappelsAutomatiques: true
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paramètres</h2>
          <p className="text-muted-foreground">
            Configurez les paramètres du cabinet et de l'application
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations du Cabinet
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom du Cabinet</Label>
              <Input
                id="nom"
                value={cabinetInfo.nom}
                onChange={(e) => setCabinetInfo({...cabinetInfo, nom: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={cabinetInfo.adresse}
                onChange={(e) => setCabinetInfo({...cabinetInfo, adresse: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={cabinetInfo.telephone}
                  onChange={(e) => setCabinetInfo({...cabinetInfo, telephone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={cabinetInfo.email}
                  onChange={(e) => setCabinetInfo({...cabinetInfo, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rc">RC</Label>
                <Input
                  id="rc"
                  value={cabinetInfo.rc}
                  onChange={(e) => setCabinetInfo({...cabinetInfo, rc: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="patente">Patente</Label>
                <Input
                  id="patente"
                  value={cabinetInfo.patente}
                  onChange={(e) => setCabinetInfo({...cabinetInfo, patente: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="ice">ICE</Label>
                <Input
                  id="ice"
                  value={cabinetInfo.ice}
                  onChange={(e) => setCabinetInfo({...cabinetInfo, ice: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Échéances fiscales par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir les rappels d'échéances par email
                </p>
              </div>
              <Switch
                checked={notifications.emailEcheances}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, emailEcheances: checked})
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Factures par email</Label>
                <p className="text-sm text-muted-foreground">
                  Envoyer les factures automatiquement par email
                </p>
              </div>
              <Switch
                checked={notifications.emailFactures}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, emailFactures: checked})
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS urgents</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir les alertes urgentes par SMS
                </p>
              </div>
              <Switch
                checked={notifications.smsUrgent}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, smsUrgent: checked})
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappels automatiques</Label>
                <p className="text-sm text-muted-foreground">
                  Activer les rappels automatiques pour les tâches
                </p>
              </div>
              <Switch
                checked={notifications.rappelsAutomatiques}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, rappelsAutomatiques: checked})
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Utilisateurs
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium">Développeur (SuperAdmin)</div>
                <div className="text-sm text-muted-foreground">Accès complet au système</div>
              </div>
            </div>
            <Badge variant="destructive">SuperAdmin</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Dirigeant Cabinet (Admin)</div>
                <div className="text-sm text-muted-foreground">Gestion du cabinet et des employés</div>
              </div>
            </div>
            <Badge>Admin</Badge>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Authentification requise</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Pour activer la gestion des utilisateurs et l'authentification, vous devez connecter votre projet à Supabase.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
