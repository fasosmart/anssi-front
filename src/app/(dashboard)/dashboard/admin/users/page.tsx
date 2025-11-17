"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Eye,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Plus,
  Minus,
  X
} from "lucide-react";
import Link from "next/link";
import { UserList, PaginatedUserList, GroupPermission, PaginatedGroupPermissionList } from "@/types/api";
import { AdminAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function UsersListPage() {
  const [users, setUsers] = useState<UserList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [staffFilter, setStaffFilter] = useState<string>("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Selection & Bulk actions
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isManageGroupsDialogOpen, setIsManageGroupsDialogOpen] = useState(false);
  const [manageGroupsAction, setManageGroupsAction] = useState<"add" | "remove" | null>(null);
  const [availableGroups, setAvailableGroups] = useState<GroupPermission[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [isManagingGroups, setIsManagingGroups] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: { limit?: number; offset?: number } = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      const data = await AdminAPI.listUsers(params);
      
      // Handle paginated response
      if ('results' in data && 'count' in data) {
        const paginatedData = data as PaginatedUserList;
        setUsers(paginatedData.results);
        setTotalCount(paginatedData.count);
      } else {
        // Handle non-paginated response (array)
        const usersArray = data as UserList[];
        setUsers(usersArray);
        setTotalCount(usersArray.length);
      }
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const errorMessage = error.response?.data?.detail || "Erreur lors du chargement des utilisateurs";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Réinitialiser la sélection lors du changement de page
    setSelectedUsers(new Set());
  }, [page]);

  // Filter users by staff status client-side if needed
  const filteredUsers = staffFilter === "all" 
    ? users 
    : users.filter(user => {
        if (staffFilter === "staff") return user.is_staff;
        if (staffFilter === "non-staff") return !user.is_staff;
        return true;
      });

  const handleStaffFilterChange = (value: string) => {
    setStaffFilter(value);
  };

  // Gestion de la sélection
  const toggleUserSelection = (userSlug: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userSlug)) {
      newSelection.delete(userSlug);
    } else {
      newSelection.add(userSlug);
    }
    setSelectedUsers(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.slug)));
    }
  };

  const clearSelection = () => {
    setSelectedUsers(new Set());
  };

  // Charger les groupes disponibles
  const loadGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const data = await AdminAPI.listGroupPermissions({ limit: 100 });
      setAvailableGroups((data as PaginatedGroupPermissionList).results || []);
    } catch (e) {
      toast.error("Impossible de charger la liste des groupes");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Ouvrir le dialog de gestion des groupes
  const openManageGroupsDialog = (action: "add" | "remove") => {
    if (selectedUsers.size === 0) {
      toast.error("Veuillez sélectionner au moins un utilisateur");
      return;
    }
    setManageGroupsAction(action);
    setSelectedGroups([]);
    setIsManageGroupsDialogOpen(true);
    loadGroups();
  };

  // Appliquer l'action (add/remove groups)
  const handleApplyGroupAction = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Veuillez sélectionner au moins un groupe");
      return;
    }

    const userSlugs = Array.from(selectedUsers);
    setIsManagingGroups(true);

    try {
      if (manageGroupsAction === "add") {
        await AdminAPI.addGroupsToUsers(userSlugs, selectedGroups);
        toast.success(`${selectedGroups.length} groupe(s) ajouté(s) à ${userSlugs.length} utilisateur(s)`);
      } else {
        await AdminAPI.removeGroupsFromUsers(userSlugs, selectedGroups);
        toast.success(`${selectedGroups.length} groupe(s) retiré(s) de ${userSlugs.length} utilisateur(s)`);
      }
      
      setIsManageGroupsDialogOpen(false);
      setSelectedGroups([]);
      setSelectedUsers(new Set());
      await fetchUsers(); // Rafraîchir la liste
    } catch (e) {
      const err = e as AxiosError<{ detail?: string }>;
      const errorMessage = err.response?.data?.detail || `Erreur lors de l'${manageGroupsAction === "add" ? "ajout" : "retrait"} des groupes`;
      toast.error(errorMessage);
    } finally {
      setIsManagingGroups(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs du système et leurs permissions
          </p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          {isLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <CardTitle>Filtre</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="w-full sm:w-[200px]">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={staffFilter} onValueChange={handleStaffFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="non-staff">Non-staff</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.is_staff).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Super utilisateurs</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.is_superuser).length}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          {isLoading ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <CardTitle>Liste des utilisateurs</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {error && !isLoading && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Sélectionner tout"
                      />
                    </TableHead>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Super utilisateur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow 
                      key={user.slug}
                      className={selectedUsers.has(user.slug) ? "bg-accent/50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.has(user.slug)}
                          onCheckedChange={() => toggleUserSelection(user.slug)}
                          aria-label={`Sélectionner ${user.first_name} ${user.last_name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.is_staff ? (
                          <Badge variant="default" className="bg-green-500">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Oui
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <UserX className="h-3 w-3 mr-1" />
                            Non
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.is_superuser ? (
                          <Badge variant="default" className="bg-purple-500">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Oui
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Shield className="h-3 w-3 mr-1" />
                            Non
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/admin/users/${user.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && filteredUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages} ({totalCount} utilisateur{totalCount > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barre d'actions flottante pour les utilisateurs sélectionnés */}
      {selectedUsers.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
          <Card className="shadow-lg border-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {selectedUsers.size}
                  </div>
                  <span className="font-medium">
                    {selectedUsers.size} utilisateur{selectedUsers.size > 1 ? "s" : ""} sélectionné{selectedUsers.size > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openManageGroupsDialog("add")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter aux groupes
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openManageGroupsDialog("remove")}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Retirer des groupes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog de gestion des groupes en masse */}
      <Dialog open={isManageGroupsDialogOpen} onOpenChange={setIsManageGroupsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {manageGroupsAction === "add" ? "Ajouter aux groupes" : "Retirer des groupes"}
            </DialogTitle>
            <DialogDescription>
              {manageGroupsAction === "add" 
                ? `Sélectionnez les groupes à ajouter à ${selectedUsers.size} utilisateur(s)`
                : `Sélectionnez les groupes à retirer de ${selectedUsers.size} utilisateur(s)`
              }
              {selectedGroups.length > 0 && (
                <span className={`ml-2 font-semibold ${manageGroupsAction === "add" ? "text-primary" : "text-destructive"}`}>
                  ({selectedGroups.length} sélectionné{selectedGroups.length > 1 ? "s" : ""})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {isLoadingGroups ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : availableGroups.length > 0 ? (
              <div className="space-y-2">
                {availableGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center space-x-3 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGroups([...selectedGroups, group.id]);
                        } else {
                          setSelectedGroups(selectedGroups.filter((id) => id !== group.id));
                        }
                      }}
                      disabled={isManagingGroups}
                    />
                    <Label
                      htmlFor={`group-${group.id}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{group.name}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center">
                <Shield className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Aucun groupe disponible
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsManageGroupsDialogOpen(false);
                setSelectedGroups([]);
              }}
              disabled={isManagingGroups}
            >
              Annuler
            </Button>
            <Button
              onClick={handleApplyGroupAction}
              disabled={selectedGroups.length === 0 || isManagingGroups}
              variant={manageGroupsAction === "add" ? "default" : "destructive"}
            >
              {isManagingGroups 
                ? "Traitement..." 
                : manageGroupsAction === "add"
                  ? `Ajouter ${selectedGroups.length} groupe(s)`
                  : `Retirer ${selectedGroups.length} groupe(s)`
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

