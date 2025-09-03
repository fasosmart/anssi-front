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
  idcard_issued_at?: string | null;
  idcard_expires_at?: string | null;
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
    job_title: string;
    company: string;
    start_date: string;
    end_date?: string | null;
    file?: string | null;
}
