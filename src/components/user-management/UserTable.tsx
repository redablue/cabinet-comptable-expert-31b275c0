
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, UserCheck, Users } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface UserTableProps {
  userProfiles: UserProfile[];
}

export function UserTable({ userProfiles }: UserTableProps) {
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

  return (
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
  );
}
