"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  User,
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Edit,
  Save,
  X
} from "lucide-react";
import Link from "next/link";
import { use as usePromise, useEffect, useState } from "react";
import { AdminAPI } from "@/lib/api";
import { User as UserType } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AxiosError } from "axios";

interface PageProps { params: Promise<{ slug: string }> }

export default function UserDetailPage({ params }: PageProps) {
  const { slug } = usePromise(params);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    is_staff: false,
  });
  
  // Toggle staff dialog
  const [toggleStaffOpen, setToggleStaffOpen] = useState(false);
  const [newStaffStatus, setNewStaffStatus] = useState(false);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminAPI.getUser(slug);
      setUser(data as UserType);
      setEditForm({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        is_staff: data.is_staff,
      });
    } catch (e) {
      setError("Impossible de charger les détails de l'utilisateur");
      toast.error("Échec du chargement des détails de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await AdminAPI.getUser(slug);
        if (!isMounted) return;
        setUser(data as UserType);
        setEditForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          is_staff: data.is_staff,
        });
      } catch (e) {
        if (!isMounted) return;
        setError("Impossible de charger les détails de l'utilisateur");
        toast.error("Échec du chargement des détails de l'utilisateur");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [slug]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_staff: user.is_staff,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsActing(true);
    try {
      await AdminAPI.updateUser(slug, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        is_staff: editForm.is_staff,
      });
      toast.success("Utilisateur mis à jour avec succès");
      setIsEditing(false);
      await refetch();
    } catch (e) {
      const err = e as AxiosError<{ detail?: string }>;
      const errorMessage = err.response?.data?.detail || "Erreur lors de la mise à jour de l'utilisateur";
      toast.error(errorMessage);
    } finally {
      setIsActing(false);
    }
  };

  const handleToggleStaff = () => {
    if (!user) return;
    setNewStaffStatus(!user.is_staff);
    setToggleStaffOpen(true);
  };

  const confirmToggleStaff = async () => {
    if (!user) return;
    
    setIsActing(true);
    try {
      await AdminAPI.updateUser(slug, {
        is_staff: newStaffStatus,
      });
      toast.success(`Statut staff ${newStaffStatus ? 'activé' : 'désactivé'} avec succès`);
      setToggleStaffOpen(false);
      await refetch();
    } catch (e) {
      const err = e as AxiosError<{ detail?: string }>;
      const errorMessage = err.response?.data?.detail || "Erreur lors de la modification du statut staff";
      toast.error(errorMessage);
    } finally {
      setIsActing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>

        {/* Status and Actions Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              {error || "Utilisateur introuvable"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normalise le format des groupes renvoyés par l'API pour l'affichage (string, number ou objet complet)
  const resolvedGroups = Array.isArray(user.groups)
    ? user.groups.map((group, index) => {
        if (typeof group === "string") {
          return { id: index, label: group };
        }
        if (typeof group === "number") {
          return { id: group, label: `Groupe #${group}` };
        }
        return {
          id: group.id ?? index,
          label: group.name ?? `Groupe #${group.id ?? index}`,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground">
            Détails de l&apos;utilisateur
          </p>
        </div>
      </div>

      {/* Statut global + actions rapides (édition + bascule staff) */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.is_staff ? (
                <Badge variant="default" className="bg-green-500">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Staff
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <UserX className="h-3 w-3 mr-1" />
                  Non-staff
                </Badge>
              )}
              {user.is_superuser && (
                <Badge variant="default" className="bg-purple-500">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Super utilisateur
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant={user.is_staff ? "destructive" : "default"}
                    onClick={handleToggleStaff}
                    disabled={isActing}
                  >
                    {user.is_staff ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Retirer le statut staff
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Accorder le statut staff
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isActing}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isActing}>
                    <Save className="h-4 w-4 mr-2" />
                    {isActing ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue tabulée : séparation claire entre le profil et la partie permissions/groupes */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">
            Profil
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex-1 sm:flex-none">
            Permissions & groupes
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil : informations éditables + badges de statut */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Détails de l&apos;utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      disabled={isActing}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.first_name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      disabled={isActing}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.last_name}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    disabled={isActing}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Statut staff</Label>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_staff"
                      checked={editForm.is_staff}
                      onChange={(e) => setEditForm({ ...editForm, is_staff: e.target.checked })}
                      disabled={isActing}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_staff" className="font-normal cursor-pointer">
                      Accorder le statut staff à cet utilisateur
                    </Label>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    {user.is_staff ? (
                      <>
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span>Oui</span>
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                        <span>Non</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              {user.is_superuser && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Super utilisateur</Label>
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <ShieldCheck className="h-4 w-4 text-purple-500" />
                      <span>Oui (non modifiable)</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Permissions/Groupe : synthèse des droits + liste des groupes éventuels */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Permissions de base</CardTitle>
                <CardDescription>
                  Accès hérités des statuts staff / super utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={user.is_staff ? "default" : "secondary"} className={user.is_staff ? "bg-green-500" : ""}>
                    {user.is_staff ? "Peut gérer l'admin" : "Accès utilisateur"}
                  </Badge>
                  <Badge variant={user.is_superuser ? "default" : "secondary"} className={user.is_superuser ? "bg-purple-500" : ""}>
                    {user.is_superuser ? "Super pouvoirs" : "Permissions standard"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Les permissions avancées seront bientôt configurables par groupe. Utilisez l&apos;onglet groupes pour organiser les rôles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Groupes rattachés</CardTitle>
                  <CardDescription>Organisez les rôles et accès par groupe</CardDescription>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Gérer les groupes
                </Button>
              </CardHeader>
              <CardContent>
                {resolvedGroups.length > 0 ? (
                  <div className="space-y-3">
                    {resolvedGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {typeof group.label === "string" ? group.label.charAt(0).toUpperCase() : "G"}
                          </div>
                          <div>
                            <p className="font-medium">{group.label}</p>
                            <p className="text-sm text-muted-foreground">
                              ID&nbsp;: {group.id}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Actif</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center">
                    <Shield className="h-10 w-10 text-muted-foreground" />
                    <p className="font-medium">Aucun groupe associé</p>
                    <p className="text-sm text-muted-foreground">
                      Cet utilisateur héritera uniquement des permissions de base. Ajoutez-le à un groupe pour personnaliser ses accès.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Toggle Staff Confirmation Dialog */}
      <AlertDialog open={toggleStaffOpen} onOpenChange={setToggleStaffOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStaffStatus ? "Accorder le statut staff" : "Retirer le statut staff"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStaffStatus 
                ? `Êtes-vous sûr de vouloir accorder le statut staff à ${user.first_name} ${user.last_name} ?`
                : `Êtes-vous sûr de vouloir retirer le statut staff à ${user.first_name} ${user.last_name} ?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActing}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStaff} disabled={isActing}>
              {isActing ? "Traitement..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

