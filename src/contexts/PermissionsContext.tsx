"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserAPI } from "@/lib/api";

// Clef unique utilisée pour sérialiser les permissions en localStorage.
const STORAGE_KEY = "anssi:admin-permissions";

type PermissionsContextValue = {
  permissions: string[];
  isLoading: boolean;
  hasPermission: (code: string) => boolean;
  hasAnyPermission: (codes: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextValue | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isStaff = Boolean(session?.user?.is_staff);

  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lecture des permissions stockées localement afin d'éviter des refetchs systématiques.
  const readCachedPermissions = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setPermissions(parsed);
        }
      }
    } catch (error) {
      console.warn("Impossible de lire les permissions depuis le cache local:", error);
    }
  }, []);

  // Persistance locale pour les prochains rafraîchissements (aide aux rechargements / navigation).
  const writeCachedPermissions = (list: string[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.warn("Impossible d'enregistrer les permissions dans le cache local:", error);
    }
  };

  // Nettoyage explicite (utilisé lors d'une déconnexion ou si l'utilisateur n'est pas staff).
  const clearCachedPermissions = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  /**
   * Récupère la liste des permissions auprès du backend.
   * Cette fonction s'assure que :
   * - Seuls les utilisateurs staff authentifiés déclenchent l'appel.
   * - Les permissions sont mises en cache local pour optimiser les accès.
   */
  const fetchPermissions = useCallback(async () => {
    if (!isStaff || status !== "authenticated") {
      setPermissions([]);
      clearCachedPermissions();
      return;
    }

    setIsLoading(true);
    try {
      const data = await UserAPI.getPermissions();
      const list = Array.isArray(data) ? data : data?.permissions ?? [];
      setPermissions(list);
      writeCachedPermissions(list);
    } catch (error) {
      console.error("Erreur lors du chargement des permissions administrateur:", error);
      toast.error("Impossible de charger les permissions administrateur");
    } finally {
      setIsLoading(false);
    }
  }, [isStaff, status]);

  useEffect(() => {
    if (status !== "authenticated") {
      setPermissions([]);
      clearCachedPermissions();
      return;
    }

    if (!isStaff) {
      setPermissions([]);
      clearCachedPermissions();
      return;
    }

    readCachedPermissions();
    fetchPermissions();
  }, [status, isStaff, readCachedPermissions, fetchPermissions]);

  // Helpers exposés pour interroger facilement l'état des permissions depuis l'UI.
  const hasPermission = useCallback(
    (code: string) => permissions.includes(code),
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (codes: string[]) => codes.some((code) => permissions.includes(code)),
    [permissions]
  );

  const value = useMemo<PermissionsContextValue>(
    () => ({
      permissions,
      isLoading,
      hasPermission,
      hasAnyPermission,
      refreshPermissions: fetchPermissions,
    }),
    [permissions, isLoading, hasPermission, hasAnyPermission, fetchPermissions]
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions doit être utilisé au sein d'un PermissionsProvider");
  }
  return context;
}

