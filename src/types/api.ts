export interface Entity {
  slug?: string;
  name: string;
  acronym?: string | null;
  business_sector?: string | null;
  tax_id?: string | null;
  commercial_register?: string | null;
  total_staff?: number | null;
  cybersecurity_experts?: number | null;
  address?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
  entity_type: 'personal' | 'business' | 'ngo';
  created_at?: string;
}

export interface Representative {
  slug?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  job_title: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  idcard_number?: string | null;
  idcard_issued_at?: string | null; // This corresponds to idDeliveryDate
  idcard_expires_at?: string | null; // This corresponds to idExpirationDate
}

export interface Degree {
  slug?: string;
  created_at?: string;
  degree_name: string;
  institution: string;
  specialty?: string; // Added specialty to match form data
  year_obtained: number;
  file?: string | null;
}

export interface Training {
    slug?: string;
    created_at?: string;
    training_name: string;
    institution: string;
    year_obtained: number;
    file?: string | null;
}

export interface Experience {
    slug?: string;
    created_at?: string;
    job_title: string; // Corresponds to 'position' in the form
    company: string; // Corresponds to 'organization' in the form
    start_date: string; // Needs to be constructed
    end_date?: string | null; // Needs to be constructed
    file?: string | null; // Corresponds to 'reference' (if it's a file path)
}

export interface DossierFormData {
  companyInfo?: Partial<Entity>;
  legalRepresentative?: Partial<Representative>;
  representativeDiplomas?: Partial<Degree>[];
  representativeCertifications?: Partial<Training>[];
  representativeExperience?: Partial<Experience>[];
  accreditationTypes?: {
    apacs: boolean;
    apassi: boolean;
    apdis: boolean;
    apris: boolean;
    apin: boolean;
  };
  uploadedDocuments?: {
    idCopy: File | null;
    taxIdCopy: File | null;
    tradeRegisterCopy: File | null;
  };
  declaration?: boolean;
}
