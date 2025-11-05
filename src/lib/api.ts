const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
import apiClient from "./apiClient";

export const API = {
  // Authentication
  login: () => `${BASE_URL}/auth/jwt/create/`,
  refresh: () => `${BASE_URL}/auth/jwt/refresh/`,
  me: () => `${BASE_URL}/users/me/`,
  permissions: () => `${BASE_URL}/users/permission/list/`,

  // Entities
  entities: {
    list: () => `${BASE_URL}/entities/`,
    create: () => `${BASE_URL}/entities/`,
    details: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    update: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    delete: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    submitForReview: (slug: string) => `${BASE_URL}/entities/${slug}/submit_entity_for_review/`,
  },

  // Documents
  documents: {
    list: (entitySlug: string) => `${BASE_URL}/entities/${entitySlug}/documents/`,
    create: (entitySlug: string) => `${BASE_URL}/entities/${entitySlug}/documents/`,
    details: (entitySlug: string, docSlug: string) => `${BASE_URL}/entities/${entitySlug}/documents/${docSlug}/`,
    update: (entitySlug: string, docSlug: string) => `${BASE_URL}/entities/${entitySlug}/documents/${docSlug}/`,
    delete: (entitySlug: string, docSlug: string) => `${BASE_URL}/entities/${entitySlug}/documents/${docSlug}/`,
  },

  // Representatives
  representatives: {
    list: (entitySlug: string) => `${BASE_URL}/${entitySlug}/representatives/`,
    create: (entitySlug: string) => `${BASE_URL}/${entitySlug}/representatives/`,
    details: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/`,
    update: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/`,
    delete: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/`,
  },

  // Degrees
  degrees: {
    list: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/degrees/`,
    create: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/degrees/`,
    details: (entitySlug: string, repSlug: string, degreeSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/degrees/${degreeSlug}/`,
    update: (entitySlug: string, repSlug: string, degreeSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/degrees/${degreeSlug}/`,
    delete: (entitySlug: string, repSlug: string, degreeSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/degrees/${degreeSlug}/`,
  },
  
  // Trainings
  trainings: {
     list: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/trainings/`,
     create: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/trainings/`,
     details: (entitySlug: string, repSlug: string, trainingSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/trainings/${trainingSlug}/`,
     update: (entitySlug: string, repSlug: string, trainingSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/trainings/${trainingSlug}/`,
     delete: (entitySlug: string, repSlug: string, trainingSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/trainings/${trainingSlug}/`,
  },
  
  // Experiences
  experiences: {
    list: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/experiences/`,
    create: (entitySlug: string, repSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/experiences/`,
    details: (entitySlug: string, repSlug: string, expSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/experiences/${expSlug}/`,
    update: (entitySlug: string, repSlug: string, expSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/experiences/${expSlug}/`,
    delete: (entitySlug: string, repSlug: string, expSlug: string) => `${BASE_URL}/${entitySlug}/representatives/${repSlug}/experiences/${expSlug}/`,
  },

  // Countries
  countries: {
    list: () => `${BASE_URL}/countries/`,
  },

  // Document Types
  documentTypes: {
    list: () => `${BASE_URL}/entities/document-type/`,
  }
  ,
  // Administrations (Espace admin)
  administrations: {
    entities: {
      list: () => `${BASE_URL}/administrations/entities/`,
      details: (slug: string) => `${BASE_URL}/administrations/entities/${slug}/`,
      setUnderReview: (slug: string) => `${BASE_URL}/administrations/entities/${slug}/under_review/`,
      setValidated: (slug: string) => `${BASE_URL}/administrations/entities/${slug}/validated/`,
      setBlocked: (slug: string) => `${BASE_URL}/administrations/entities/${slug}/blocked/`,
      unblock: (slug: string) => `${BASE_URL}/administrations/entities/${slug}/unblock/`,
      setDeclined: (slug: string) => `${BASE_URL}/administrations/entities/${slug}/declined/`,
    },
    accreditations: {
      list: () => `${BASE_URL}/administrations/accreditations/`,
      details: (slug: string) => `${BASE_URL}/administrations/accreditations/${slug}/`,
    },
    users: {
      updateStaff: (slug: string) => `${BASE_URL}/administrations/update-user/${slug}/`,
    }
  }
};

// Administrations - Helpers centralisés (cohérence d'accès API)
// NOTE: On centralise ici pour éviter la dispersion des appels côté client
export const AdminAPI = {
  listEntities: async (params?: { status?: string; entity_type?: string; search?: string; limit?: number; offset?: number; }) => {
    const response = await apiClient.get(`/api/administrations/entities/`, { params });
    return response.data;
  },
  getEntity: async (slug: string) => {
    const response = await apiClient.get(`/api/administrations/entities/${slug}/`);
    return response.data;
  },
  setUnderReview: async (slug: string) => {
    const response = await apiClient.patch(`/api/administrations/entities/${slug}/under_review/`);
    return response.data;
  },
  setValidated: async (slug: string) => {
    const response = await apiClient.patch(`/api/administrations/entities/${slug}/validated/`);
    return response.data;
  },
  setBlocked: async (slug: string) => {
    const response = await apiClient.patch(`/api/administrations/entities/${slug}/blocked/`);
    return response.data;
  },
  unblock: async (slug: string) => {
    const response = await apiClient.patch(`/api/administrations/entities/${slug}/unblock/`);
    return response.data;
  },
  setDeclined: async (slug: string, rejection_reason: string) => {
    const response = await apiClient.patch(`/api/administrations/entities/${slug}/declined/`, { rejection_reason });
    return response.data;
  },
  // Accréditations (admin)
  listAccreditations: async (params?: { status?: string; search?: string; limit?: number; offset?: number; }) => {
    const response = await apiClient.get(`/api/administrations/accreditations/`, { params });
    return response.data;
  },
  getAccreditation: async (slug: string) => {
    const response = await apiClient.get(`/api/administrations/accreditations/${slug}/`);
    return response.data;
  },
};

// Users - Helpers centralisés
export const UserAPI = {
  getPermissions: async () => {
    const response = await apiClient.get(`/api/users/permission/list/`);
    return response.data;
  },
};
