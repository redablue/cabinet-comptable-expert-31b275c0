
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function AccessDenied() {
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
