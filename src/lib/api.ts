const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export const API = {
  // Authentication
  login: () => `${BASE_URL}/auth/jwt/create/`,
  me: () => `${BASE_URL}/users/me/`,

  // Entities
  entities: {
    list: () => `${BASE_URL}/entities/`,
    create: () => `${BASE_URL}/entities/`,
    details: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    update: (slug: string) => `${BASE_URL}/entities/${slug}/`,
    delete: (slug: string) => `${BASE_URL}/entities/${slug}/`,
  },

  // Representatives
  representatives: {
    list: (entitySlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/`,
    create: (entitySlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/`,
    details: (entitySlug: string, repSlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/${repSlug}/`,
    update: (entitySlug: string, repSlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/${repSlug}/`,
    delete: (entitySlug: string, repSlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/${repSlug}/`,
  },

  // Degrees
  degrees: {
    create: (entitySlug: string, repSlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/${repSlug}/degrees/`,
  },
  
  // Trainings
  trainings: {
     create: (entitySlug: string, repSlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/${repSlug}/trainings/`,
  },
  
  // Experiences
  experiences: {
    create: (entitySlug: string, repSlug: string) => `${BASE_URL}/entities/${entitySlug}/representatives/${repSlug}/experiences/`,
  }
};
