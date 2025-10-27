import { useState, useEffect } from 'react';
import { DocumentType } from '@/types/api';
import apiClient from '@/lib/apiClient';
import { API } from '@/lib/api';

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get(API.documentTypes.list());
        setDocumentTypes(response.data.results || []);
      } catch (err) {
        console.error('Erreur lors du chargement des types de documents:', err);
        setError('Impossible de charger les types de documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  return { documentTypes, isLoading, error };
};
