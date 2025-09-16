const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const API = {
  // Authentication
  login: () => `${BASE_URL}/auth/jwt/create/`,
  refresh: () => `${BASE_URL}/auth/jwt/refresh/`,
  me: () => `${BASE_URL}/users/me/`,

  // Entities
  entities: {
    list: () => `${BASE_URL}/entities/`,
    create: () => `${BASE_URL}/entities/`,
    details: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    update: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    delete: (slug: string) => `${BASE_URL}/entities/${slug}/`,
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
  }
};
