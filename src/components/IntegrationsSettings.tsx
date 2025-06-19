
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, HardDrive, Send, Download, Upload, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function IntegrationsSettings() {
  const { toast } = useToast();
  const [whatsappConfig, setWhatsappConfig] = useState({
    phoneNumber: "+212600000000",
    apiToken: "",
    enabled: false,
    autoSendDocuments: true,
    notifyClients: true
  });

  const [googleDriveConfig, setGoogleDriveConfig] = useState({
    clientId: "",
    clientSecret: "",
    enabled: false,
    autoBackup: true,
    backupInterval: "daily"
  });

  const [isConnecting, setIsConnecting] = useState(false);

  const handleWhatsAppConnect = async () => {
    setIsConnecting(true);
    // Simulation de connexion
    setTimeout(() => {
      setWhatsappConfig(prev => ({ ...prev, enabled: true }));
      setIsConnecting(false);
      toast({
        title: "WhatsApp connecté",
        description: "L'intégration WhatsApp a été configurée avec succès.",
      });
    }, 2000);
  };

  const handleGoogleDriveConnect = async () => {
    setIsConnecting(true);
    // Simulation de connexion
    setTimeout(() => {
      setGoogleDriveConfig(prev => ({ ...prev, enabled: true }));
      setIsConnecting(false);
      toast({
        title: "Google Drive connecté",
        description: "L'intégration Google Drive a été configurée avec succès.",
      });
    }, 2000);
  };

  const handleSendTestMessage = () => {
    toast({
      title: "Message test envoyé",
      description: "Un message de test a été envoyé via WhatsApp.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Sauvegarde lancée",
      description: "La sauvegarde sur Google Drive est en cours...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Intégrations</h3>
        <p className="text-muted-foreground">
          Configurez les intégrations avec WhatsApp et Google Drive
        </p>
      </div>

      {/* WhatsApp Integration */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">WhatsApp Business</h4>
              <p className="text-sm text-muted-foreground">
                Communication interne et externe, envoi de documents
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {whatsappConfig.enabled ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Connecté</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <X className="h-4 w-4" />
                <span className="text-sm">Non connecté</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp-phone">Numéro WhatsApp Business</Label>
              <Input
                id="whatsapp-phone"
                value={whatsappConfig.phoneNumber}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+212600000000"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp-token">Token API WhatsApp</Label>
              <Input
                id="whatsapp-token"
                type="password"
                value={whatsappConfig.apiToken}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, apiToken: e.target.value }))}
                placeholder="Entrez votre token API"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Envoi automatique des documents</Label>
                <p className="text-sm text-muted-foreground">
                  Envoyer automatiquement les factures et documents aux clients
                </p>
              </div>
              <Switch
                checked={whatsappConfig.autoSendDocuments}
                onCheckedChange={(checked) => 
                  setWhatsappConfig(prev => ({ ...prev, autoSendDocuments: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications clients</Label>
                <p className="text-sm text-muted-foreground">
                  Notifier les clients des échéances fiscales
                </p>
              </div>
              <Switch
                checked={whatsappConfig.notifyClients}
                onCheckedChange={(checked) => 
                  setWhatsappConfig(prev => ({ ...prev, notifyClients: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleWhatsAppConnect}
              disabled={isConnecting || whatsappConfig.enabled}
              className="flex-1"
            >
              {whatsappConfig.enabled ? "Connecté" : "Connecter WhatsApp"}
            </Button>
            {whatsappConfig.enabled && (
              <Button 
                variant="outline" 
                onClick={handleSendTestMessage}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Test
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Google Drive Integration */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Google Drive</h4>
              <p className="text-sm text-muted-foreground">
                Sauvegarde automatique de la base de données et documents
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {googleDriveConfig.enabled ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Connecté</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <X className="h-4 w-4" />
                <span className="text-sm">Non connecté</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="drive-client-id">Client ID Google</Label>
              <Input
                id="drive-client-id"
                value={googleDriveConfig.clientId}
                onChange={(e) => setGoogleDriveConfig(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Votre Client ID Google"
              />
            </div>
            <div>
              <Label htmlFor="drive-client-secret">Client Secret</Label>
              <Input
                id="drive-client-secret"
                type="password"
                value={googleDriveConfig.clientSecret}
                onChange={(e) => setGoogleDriveConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="Votre Client Secret"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder automatiquement les données
                </p>
              </div>
              <Switch
                checked={googleDriveConfig.autoBackup}
                onCheckedChange={(checked) => 
                  setGoogleDriveConfig(prev => ({ ...prev, autoBackup: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Fréquence de sauvegarde</Label>
                <p className="text-sm text-muted-foreground">
                  Définir la fréquence des sauvegardes automatiques
                </p>
              </div>
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={googleDriveConfig.backupInterval}
                onChange={(e) => setGoogleDriveConfig(prev => ({ ...prev, backupInterval: e.target.value }))}
              >
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleGoogleDriveConnect}
              disabled={isConnecting || googleDriveConfig.enabled}
              className="flex-1"
            >
              {googleDriveConfig.enabled ? "Connecté" : "Connecter Google Drive"}
            </Button>
            {googleDriveConfig.enabled && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleBackupNow}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Restaurer
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
