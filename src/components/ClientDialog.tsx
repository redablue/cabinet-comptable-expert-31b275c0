
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientType = Database['public']['Enums']['client_type'];
type ClientStatus = Database['public']['Enums']['client_status'];

interface ClientDialogProps {
  onSubmit: (client: any) => void;
  client?: Client;
  isLoading?: boolean;
}

export function ClientDialog({ onSubmit, client, isLoading }: ClientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    nom_commercial: client?.nom_commercial || '',
    raison_sociale: client?.raison_sociale || '',
    type_client: client?.type_client || 'SARL' as ClientType,
    statut: client?.statut || 'Actif' as ClientStatus,
    identifiant_fiscal: client?.identifiant_fiscal || '',
    numero_rc: client?.numero_rc || '',
    ice: client?.ice || '',
    identifiant_dgi: client?.identifiant_dgi || '',
    mot_de_passe_dgi: client?.mot_de_passe_dgi || '',
    identifiant_damancom: client?.identifiant_damancom || '',
    mot_de_passe_damancom: client?.mot_de_passe_damancom || '',
    email: client?.email || '',
    telephone: client?.telephone || '',
    adresse: client?.adresse || '',
    ville: client?.ville || '',
    code_postal: client?.code_postal || '',
    notes: client?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData = {
      ...formData,
      created_by: user?.id,
      ...(client && { id: client.id })
    };
    
    onSubmit(clientData);
    setIsOpen(false);
  };

  const resetForm = () => {
    if (!client) {
      setFormData({
        nom_commercial: '',
        raison_sociale: '',
        type_client: 'SARL' as ClientType,
        statut: 'Actif' as ClientStatus,
        identifiant_fiscal: '',
        numero_rc: '',
        ice: '',
        identifiant_dgi: '',
        mot_de_passe_dgi: '',
        identifiant_damancom: '',
        mot_de_passe_damancom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        code_postal: '',
        notes: '',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          {client ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {client ? 'Modifier' : 'Nouveau Client'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Modifier le Client' : 'Nouveau Client'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom_commercial">Nom Commercial *</Label>
              <Input
                id="nom_commercial"
                value={formData.nom_commercial}
                onChange={(e) => setFormData(prev => ({ ...prev, nom_commercial: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="raison_sociale">Raison Sociale</Label>
              <Input
                id="raison_sociale"
                value={formData.raison_sociale}
                onChange={(e) => setFormData(prev => ({ ...prev, raison_sociale: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type_client">Type de Client</Label>
              <Select value={formData.type_client} onValueChange={(value: ClientType) => setFormData(prev => ({ ...prev, type_client: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SARL">SARL</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="Auto-entrepreneur">Auto-entrepreneur</SelectItem>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Association">Association</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value: ClientStatus) => setFormData(prev => ({ ...prev, statut: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="identifiant_fiscal">Identifiant Fiscal</Label>
              <Input
                id="identifiant_fiscal"
                value={formData.identifiant_fiscal}
                onChange={(e) => setFormData(prev => ({ ...prev, identifiant_fiscal: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="numero_rc">Numéro RC</Label>
              <Input
                id="numero_rc"
                value={formData.numero_rc}
                onChange={(e) => setFormData(prev => ({ ...prev, numero_rc: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="ice">ICE</Label>
              <Input
                id="ice"
                value={formData.ice}
                onChange={(e) => setFormData(prev => ({ ...prev, ice: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Identifiants DGI</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identifiant_dgi">Login DGI</Label>
                <Input
                  id="identifiant_dgi"
                  value={formData.identifiant_dgi}
                  onChange={(e) => setFormData(prev => ({ ...prev, identifiant_dgi: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="mot_de_passe_dgi">Mot de passe DGI</Label>
                <Input
                  id="mot_de_passe_dgi"
                  type="password"
                  value={formData.mot_de_passe_dgi}
                  onChange={(e) => setFormData(prev => ({ ...prev, mot_de_passe_dgi: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Identifiants DAMANCOM</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identifiant_damancom">Login DAMANCOM</Label>
                <Input
                  id="identifiant_damancom"
                  value={formData.identifiant_damancom}
                  onChange={(e) => setFormData(prev => ({ ...prev, identifiant_damancom: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="mot_de_passe_damancom">Mot de passe DAMANCOM</Label>
                <Input
                  id="mot_de_passe_damancom"
                  type="password"
                  value={formData.mot_de_passe_damancom}
                  onChange={(e) => setFormData(prev => ({ ...prev, mot_de_passe_damancom: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => setFormData(prev => ({ ...prev, ville: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="code_postal">Code Postal</Label>
              <Input
                id="code_postal"
                value={formData.code_postal}
                onChange={(e) => setFormData(prev => ({ ...prev, code_postal: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'En cours...' : (client ? 'Mettre à jour' : 'Créer')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
