
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Users, Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  phone?: string;
}

export function UserManagement() {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('pompiste');
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user profiles:', error);
      return;
    }

    setUserProfiles(data || []);
  };

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

      // Vérifier si la réponse contient une erreur
      if (data && data.error) {
        toast({
          title: 'Erreur',
          description: data.error,
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
      fetchUserProfiles();
      
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'gerant': return 'bg-red-100 text-red-800';
      case 'responsable': return 'bg-blue-100 text-blue-800';
      case 'caissier': return 'bg-green-100 text-green-800';
      case 'pompiste': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'gerant': return <Shield className="h-4 w-4" />;
      case 'responsable': return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'gerant': return 'Gérant';
      case 'responsable': return 'Responsable';
      case 'caissier': return 'Caissier';
      case 'pompiste': return 'Pompiste';
      default: return role;
    }
  };

  if (userRole !== 'responsable' && userRole !== 'gerant') {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Accès Restreint</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">
            Gérez les utilisateurs du système de gestion de station-service
          </p>
        </div>
        
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
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom Complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date de création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userProfiles.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      {getRoleDisplayName(user.role)}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note :</strong> Seuls les utilisateurs créés par l'administrateur peuvent se connecter au système. 
          L'inscription libre est désactivée pour des raisons de sécurité.
        </AlertDescription>
      </Alert>
    </div>
  );
}
