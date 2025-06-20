
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export function useClients() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: clients = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    }
  });

  const createClientMutation = useMutation({
    mutationFn: async (newClient: ClientInsert) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Succès',
        description: 'Client créé avec succès',
      });
    },
    onError: (error) => {
      console.error('Create client error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du client',
        variant: 'destructive',
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...updates }: ClientUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Succès',
        description: 'Client mis à jour avec succès',
      });
    },
    onError: (error) => {
      console.error('Update client error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du client',
        variant: 'destructive',
      });
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Succès',
        description: 'Client supprimé avec succès',
      });
    },
    onError: (error) => {
      console.error('Delete client error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression du client',
        variant: 'destructive',
      });
    }
  });

  return {
    clients,
    isLoading,
    error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}
