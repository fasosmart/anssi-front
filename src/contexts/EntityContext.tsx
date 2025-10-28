"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/lib/apiClient';
import { EntityList, EntityStatus } from '@/types/api';
import { API } from '@/lib/api';
import { submitEntityForReview } from '@/lib/apiClient';
import { toast } from 'sonner';


interface EntityContextType {
  entities: EntityList[];
  activeEntity: EntityList | null;
  setActiveEntity: (entity: EntityList | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshEntities: () => void;
  // Fonctions utilitaires pour les statuts
  canEditEntity: (entity?: EntityList | null) => boolean;
  canManageRepresentatives: (entity?: EntityList | null) => boolean;
  canCreateDemands: (entity?: EntityList | null) => boolean;
  getEntityStatusLabel: (status: EntityStatus) => string;
  getEntityStatusColor: (status: EntityStatus) => string;
  // Fonction de soumission
  submitEntityForReview: (entitySlug: string) => Promise<boolean>;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export const EntityProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [entities, setEntities] = useState<EntityList[]>([]);
  const [activeEntity, setActiveEntityState] = useState<EntityList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = async () => {
    if (status !== 'authenticated' || !session) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ results: EntityList[] }>(API.entities.list());
      const fetchedEntities = response.data.results || [];
      setEntities(fetchedEntities);

      // Restaurer l'entité active depuis localStorage si disponible
      const storedSlug = typeof window !== 'undefined' ? localStorage.getItem('activeEntitySlug') : null;
      if (storedSlug) {
        const storedEntity = fetchedEntities.find(e => e.slug === storedSlug) || null;
        setActiveEntityState(storedEntity);
      } else {
        // Ne pas auto-sélectionner si plusieurs entités: laisser l'handler rediriger vers select-entity
        // Si une seule entité, l'EntityRedirectHandler s'occupe d'auto-sélectionner
        setActiveEntityState(null);
      }
    } catch (err) {
      setError("Impossible de charger les structures.");
      toast.error("Impossible de charger les structures.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEntities();
    }
    // Nettoyage du localStorage à la déconnexion
    if (status === 'unauthenticated') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activeEntitySlug');
      }
      setActiveEntityState(null);
      setEntities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  
  const setActiveEntity = (entity: EntityList | null) => {
    setActiveEntityState(entity);
    if (entity && entity.slug) {
      localStorage.setItem('activeEntitySlug', entity.slug);
    } else {
      localStorage.removeItem('activeEntitySlug');
    }
  };

  // Fonctions utilitaires pour les permissions
  const canEditEntity = (entity?: EntityList | null) => {
    const targetEntity = entity || activeEntity;
    return targetEntity?.status === 'new' || targetEntity?.status === 'validated';
  };

  const canManageRepresentatives = (entity?: EntityList | null) => {
    const targetEntity = entity || activeEntity;
    return targetEntity?.status === 'validated';
  };

  const canCreateDemands = (entity?: EntityList | null) => {
    const targetEntity = entity || activeEntity;
    return targetEntity?.status === 'validated';
  };

  const getEntityStatusLabel = (status: EntityStatus) => {
    const labels = {
      new: 'Nouvelle',
      submitted: 'Soumise',
      under_review: 'En cours de validation',
      validated: 'Validée',
      blocked: 'Bloquée',
      declined: 'Refusée'
    };
    return labels[status] || status;
  };

  const getEntityStatusColor = (status: EntityStatus) => {
    const colors = {
      new: 'bg-blue-500',
      submitted: 'bg-yellow-500',
      under_review: 'bg-orange-500',
      validated: 'bg-green-500',
      blocked: 'bg-red-500',
      declined: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const submitEntityForReviewHandler = async (entitySlug: string): Promise<boolean> => {
    try {
      await submitEntityForReview(entitySlug);
      
      // Mettre à jour l'entité dans la liste locale
      setEntities(prevEntities => 
        prevEntities.map(entity => 
          entity.slug === entitySlug 
            ? { ...entity, status: 'under_review' as EntityStatus }
            : entity
        )
      );
      
      // Mettre à jour l'entité active si c'est celle-ci
      if (activeEntity?.slug === entitySlug) {
        setActiveEntityState(prev => 
          prev ? { ...prev, status: 'under_review' as EntityStatus } : null
        );
      }
      
      toast.success("Votre structure a été soumise pour validation avec succès !");
      return true;
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error("Une erreur est survenue lors de la soumission de votre structure.");
      return false;
    }
  };

  return (
    <EntityContext.Provider value={{ 
      entities, 
      activeEntity, 
      setActiveEntity, 
      isLoading, 
      error, 
      refreshEntities: fetchEntities,
      canEditEntity,
      canManageRepresentatives,
      canCreateDemands,
      getEntityStatusLabel,
      getEntityStatusColor,
      submitEntityForReview: submitEntityForReviewHandler
    }}>
      {children}
    </EntityContext.Provider>
  );
};

export const useEntity = () => {
  const context = useContext(EntityContext);
  if (context === undefined) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
};
