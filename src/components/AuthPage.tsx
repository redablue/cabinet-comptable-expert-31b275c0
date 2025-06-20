
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, LogIn, UserPlus, Mail, Lock, Shield } from 'lucide-react';
import { CreateSuperAdminResponse } from '@/types/user';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur de connexion',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue dans le système de gestion du cabinet',
        });
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      toast({
        title: 'Erreur',
        description: 'Impossible de se connecter au serveur',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur d\'inscription',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Inscription réussie',
          description: 'Vérifiez votre email pour confirmer votre compte',
        });
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      toast({
        title: 'Erreur',
        description: 'Impossible de se connecter au serveur',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const createSuperAdmin = async () => {
    if (!email || !password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir un email et un mot de passe avant de créer un superadmin',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // D'abord créer l'utilisateur dans l'authentification Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName || 'Administrateur Principal',
          }
        }
      });

      if (signUpError && !signUpError.message.includes('User already registered')) {
        console.error('Erreur lors de l\'inscription:', signUpError);
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le compte d\'authentification: ' + signUpError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Ensuite créer le profil superadmin dans la base de données
      const { data, error } = await supabase.rpc('create_superadmin_user', {
        admin_email: email,
        admin_password: password,
        admin_full_name: fullName || 'Administrateur Principal'
      });

      if (error) {
        console.error('Erreur lors de la création du profil:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le profil superadmin',
          variant: 'destructive',
        });
      } else {
        const result = data as CreateSuperAdminResponse;
        
        if (result?.error && !result.error.includes('existe déjà')) {
          toast({
            title: 'Information',
            description: result.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Compte Superadmin Créé',
            description: `Email: ${email} - Vérifiez votre email pour confirmer le compte`,
          });
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le compte superadmin',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cabinet Comptable
          </h1>
          <p className="text-gray-600">
            Système de Gestion Intégré
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Connexion
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte pour accéder au système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t">
                  <Button 
                    onClick={createSuperAdmin}
                    variant="outline" 
                    className="w-full text-sm gap-2"
                    disabled={loading}
                  >
                    <Shield className="h-4 w-4" />
                    Créer un compte SuperAdmin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>
                  Créez un nouveau compte pour accéder au système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Votre nom complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Système développé pour la gestion de cabinet comptable</p>
        </div>
      </div>
    </div>
  );
}
