
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
  const [newUserRole, setNewUserRole] = useState<string>('assistant');
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
      // For now, we'll show a message that this feature requires full database setup
      toast({
        title: 'Fonctionnalité en cours de développement',
        description: 'La création d\'utilisateurs nécessite la configuration complète de la base de données. Contactez votre développeur.',
        variant: 'destructive',
      });
      
      setNewUserEmail('');
      setNewUserFullName('');
      setNewUserRole('assistant');
      setIsDialogOpen(false);
      
    } catch (error) {
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
      case 'superadmin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'comptable': return 'bg-green-100 text-green-800';
      case 'assistant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <Shield className="h-4 w-4" />;
      case 'admin': return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (userRole !== 'admin' && userRole !== 'superadmin') {
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
            Gérez les utilisateurs du système de gestion comptable
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
                  placeholder="utilisateur@cabinet.ma"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assistant">Assistant</SelectItem>
                    <SelectItem value="comptable">Comptable</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    {userRole === 'superadmin' && (
                      <SelectItem value="superadmin">Super Administrateur</SelectItem>
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
                      {user.role}
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
          <strong>Note :</strong> La création d'utilisateurs nécessite la configuration complète de la base de données. 
          Actuellement, vous pouvez voir les utilisateurs existants mais la création nécessite des étapes supplémentaires.
        </AlertDescription>
      </Alert>
    </div>
  );
}
