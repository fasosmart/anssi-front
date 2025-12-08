import { useState, useEffect } from 'react';
import { UserAPI } from '@/lib/api';
import { Country } from '@/types/api';

const CACHE_KEY = 'anssi:countries';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

interface CachedCountries {
  data: Country[];
  timestamp: number;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Vérifier le cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CachedCountries = JSON.parse(cached);
          const now = Date.now();
          
          // Si le cache est encore valide (moins de 24h)
          if (now - parsed.timestamp < CACHE_DURATION && Array.isArray(parsed.data)) {
            setCountries(parsed.data);
            setIsLoading(false);
            return;
          }
        }

        // Sinon, récupérer depuis l'API
        setIsLoading(true);
        const response = await UserAPI.getCountries();
        
        // Extraire les résultats de la pagination
        const countriesList = response.results || [];
        
        // Mettre en cache
        const cacheData: CachedCountries = {
          data: countriesList,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        
        setCountries(countriesList);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des pays:', err);
        setError('Impossible de charger la liste des pays');
        
        // En cas d'erreur, essayer d'utiliser le cache même s'il est expiré
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CachedCountries = JSON.parse(cached);
          if (Array.isArray(parsed.data) && parsed.data.length > 0) {
            setCountries(parsed.data);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return {
    countries,
    isLoading,
    error,
  };
}

