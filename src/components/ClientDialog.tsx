
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: any;
}

export function ClientDialog({ isOpen, onClose, onSuccess, client }: ClientDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom_commercial: client?.nom_commercial || '',
    raison_sociale: client?.raison_sociale || '',
    type_client: client?.type_client || 'SARL',
    email: client?.email || '',
    telephone: client?.telephone || '',
    adresse: client?.adresse || '',
    ville: client?.ville || '',
    code_postal: client?.code_postal || '',
    identifiant_fiscal: client?.identifiant_fiscal || '',
    numero_rc: client?.numero_rc || '',
    ice: client?.ice || '',
    identifiant_dgi: client?.identifiant_dgi || '',
    mot_de_passe_dgi: client?.mot_de_passe_dgi || '',
    identifiant_damancom: client?.identifiant_damancom || '',
    mot_de_passe_damancom: client?.mot_de_passe_damancom || '',
    notes: client?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (client) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', client.id);

        if (error) throw error;
        toast({ title: 'Client mis à jour avec succès' });
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([formData]);

        if (error) throw error;
        toast({ title: 'Client créé avec succès' });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Modifier le client' : 'Nouveau client'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>
              
              <div>
                <Label htmlFor="nom_commercial">Nom commercial *</Label>
                <Input
                  id="nom_commercial"
                  value={formData.nom_commercial}
                  onChange={(e) => setFormData({...formData, nom_commercial: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="raison_sociale">Raison sociale</Label>
                <Input
                  id="raison_sociale"
                  value={formData.raison_sociale}
                  onChange={(e) => setFormData({...formData, raison_sociale: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="type_client">Type de client</Label>
                <Select value={formData.type_client} onValueChange={(value) => setFormData({...formData, type_client: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SARL">SARL</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="SNC">SNC</SelectItem>
                    <SelectItem value="Auto-entrepreneur">Auto-entrepreneur</SelectItem>
                    <SelectItem value="Particulier">Particulier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                />
              </div>
            </div>

            {/* Adresse et informations légales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adresse et informations légales</h3>
              
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => setFormData({...formData, ville: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => setFormData({...formData, code_postal: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="identifiant_fiscal">Identifiant fiscal</Label>
                <Input
                  id="identifiant_fiscal"
                  value={formData.identifiant_fiscal}
                  onChange={(e) => setFormData({...formData, identifiant_fiscal: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="numero_rc">Numéro RC</Label>
                <Input
                  id="numero_rc"
                  value={formData.numero_rc}
                  onChange={(e) => setFormData({...formData, numero_rc: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="ice">ICE</Label>
                <Input
                  id="ice"
                  value={formData.ice}
                  onChange={(e) => setFormData({...formData, ice: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Identifiants DGI et DAMANCOM */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identifiants DGI et DAMANCOM</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-muted-foreground">DGI</h4>
                <div>
                  <Label htmlFor="identifiant_dgi">Identifiant DGI</Label>
                  <Input
                    id="identifiant_dgi"
                    value={formData.identifiant_dgi}
                    onChange={(e) => setFormData({...formData, identifiant_dgi: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mot_de_passe_dgi">Mot de passe DGI</Label>
                  <Input
                    id="mot_de_passe_dgi"
                    type="text"
                    value={formData.mot_de_passe_dgi}
                    onChange={(e) => setFormData({...formData, mot_de_passe_dgi: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-muted-foreground">DAMANCOM</h4>
                <div>
                  <Label htmlFor="identifiant_damancom">Identifiant DAMANCOM</Label>
                  <Input
                    id="identifiant_damancom"
                    value={formData.identifiant_damancom}
                    onChange={(e) => setFormData({...formData, identifiant_damancom: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mot_de_passe_damancom">Mot de passe DAMANCOM</Label>
                  <Input
                    id="mot_de_passe_damancom"
                    type="text"
                    value={formData.mot_de_passe_damancom}
                    onChange={(e) => setFormData({...formData, mot_de_passe_damancom: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              placeholder="Notes supplémentaires..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : client ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
