
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CreateUserResponse } from '@/types/user';

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('pompiste');
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();
  const { toast } = useToast();

  const createUserProfile = async () => {
    if (!newUserEmail || !newUserFullName || !newUserRole) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Créer l'utilisateur autorisé via la fonction RPC
      const { data, error: rpcError } = await supabase.rpc('create_authorized_user', {
        user_email: newUserEmail,
        user_role: newUserRole,
        user_full_name: newUserFullName
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la création de l\'utilisateur',
          variant: 'destructive',
        });
        return;
      }

      // Type guard to check if data is an object with error property
      const response = data as CreateUserResponse;
      if (response && typeof response === 'object' && response.error) {
        toast({
          title: 'Erreur',
          description: response.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Succès',
        description: 'Utilisateur créé avec succès. Il peut maintenant s\'inscrire avec cet email.',
      });
      
      setNewUserEmail('');
      setNewUserFullName('');
      setNewUserRole('pompiste');
      setIsDialogOpen(false);
      
      // Actualiser la liste des utilisateurs
      onUserCreated();
      
    } catch (error) {
      console.error('Create user error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Créer Utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
        </DialogHeader>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            L'utilisateur recevra ses identifiants par email et pourra se connecter au système.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nom Complet</Label>
            <Input
              id="fullName"
              value={newUserFullName}
              onChange={(e) => setNewUserFullName(e.target.value)}
              placeholder="Ahmed Alami"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="utilisateur@station.ma"
            />
          </div>
          
          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select value={newUserRole} onValueChange={setNewUserRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pompiste">Pompiste</SelectItem>
                <SelectItem value="caissier">Caissier</SelectItem>
                <SelectItem value="responsable">Responsable</SelectItem>
                {userRole === 'gerant' && (
                  <SelectItem value="gerant">Gérant</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={createUserProfile} disabled={loading} className="w-full">
            {loading ? 'Création en cours...' : 'Créer Utilisateur'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
