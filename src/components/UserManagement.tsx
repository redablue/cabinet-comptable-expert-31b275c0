
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/user';
import { CreateUserDialog } from '@/components/user-management/CreateUserDialog';
import { UserTable } from '@/components/user-management/UserTable';
import { AccessDenied } from '@/components/user-management/AccessDenied';

export function UserManagement() {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const { userRole } = useAuth();

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

  if (userRole !== 'responsable' && userRole !== 'gerant') {
    return <AccessDenied />;
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
        
        <CreateUserDialog onUserCreated={fetchUserProfiles} />
      </div>

      <UserTable userProfiles={userProfiles} />
      
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
