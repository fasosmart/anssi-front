"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/lib/apiClient';
import { Entity } from '@/types/api';
import { API } from '@/lib/api';

type EntityList = Omit<Entity, "entity_type"> & { entity_type: string; is_active: boolean };

interface EntityContextType {
  entities: EntityList[];
  activeEntity: EntityList | null;
  setActiveEntity: (entity: EntityList | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshEntities: () => void;
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

      if (fetchedEntities.length > 0) {
        // Check local storage for a previously selected entity
        const lastActiveSlug = localStorage.getItem('activeEntitySlug');
        const lastActive = fetchedEntities.find(e => e.slug === lastActiveSlug);
        setActiveEntityState(lastActive || fetchedEntities[0]);
      } else {
        setActiveEntityState(null);
      }
    } catch (err) {
      setError("Impossible de charger les structures.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [session, status]);
  
  const setActiveEntity = (entity: EntityList | null) => {
    setActiveEntityState(entity);
    if (entity && entity.slug) {
      localStorage.setItem('activeEntitySlug', entity.slug);
    } else {
      localStorage.removeItem('activeEntitySlug');
    }
  };

  return (
    <EntityContext.Provider value={{ entities, activeEntity, setActiveEntity, isLoading, error, refreshEntities: fetchEntities }}>
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
