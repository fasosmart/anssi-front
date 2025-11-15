export type EntityStatus = 'new' | 'submitted' | 'under_review' | 'validated' | 'blocked' | 'declined';

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
  status?: EntityStatus;
  rejection_reason?: string | null;
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
  address?: string | null;
  idcard_number?: string | null;
  idcard_issued_at?: string | null; // This corresponds to idDeliveryDate
  idcard_expires_at?: string | null; // This corresponds to idExpirationDate
  idcard_file?: string | File | null;
}

export interface RepresentativeList {
  slug: string;
  first_name: string;
  last_name: string;
  job_title: string;
  phone?: string | null;
  email?: string | null;
}

export interface Degree {
  slug?: string;
  created_at?: string;
  degree_name: string;
  institution: string;
  specialty?: string; // Added specialty to match form data
  year_obtained: number;
  file?: string | File | null;
}

export interface Training {
    slug?: string;
    created_at?: string;
    training_name: string;
    institution: string;
    year_obtained: number;
    file?: string | File | null;
}

export interface Experience {
    slug?: string;
    created_at?: string;
    job_title: string; // Corresponds to 'position' in the form
    company: string; // Corresponds to 'organization' in the form
    start_date: string; // Needs to be constructed
    end_date?: string | null; // Needs to be constructed
    file?: string | File | null; // Corresponds to 'reference' (if it's a file path)
}

export interface DossierFormData {
  companyInfo?: Partial<Entity>;
  legalRepresentative?: Partial<Representative>;
  representativeDiplomas?: Partial<Degree>[];
  representativeCertifications?: Partial<Training>[];
  representativeExperience?: Partial<Experience>[];
  accreditationTypes?: Record<string, boolean>;
  uploadedDocuments?: {
    idCopy: File | null;
    taxIdCopy: File | null;
    tradeRegisterCopy: File | null;
  };
  declaration?: boolean;
}

export interface TypeAccreditation {
  slug: string;
  name: string;
  duration?: number;
}

export interface DocumentType {
  slug: string;
  name: string;
  description?: string | null;
  status: 'ON' | 'OFF';
}

export interface Document {
  slug?: string;
  created_at?: string;
  name: string;
  document_type: string;
  file: string | File;
  issued_at: string;
  expires_at?: string | null;
}

export type DemandStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface AccreditationList {
  slug: string;
  status: DemandStatus;
  type_accreditation: string; 
  representative: string; 
  submission_date: string | null;
  review_date: string | null;
  approval_date: string | null;
  rejection_date: string | null;
}

// AdminAccreditationList retourné par /api/administrations/accreditations/
export interface AdminAccreditationList {
  slug: string;
  entity: string;
  representative: string;
  type_accreditation: string;
  status: DemandStatus;
  submission_date: string | null;
  review_date: string | null;
  approval_date: string | null;
}

// Types pour AdminAccreditationRetrieve
export interface AccreditationDegree {
  slug: string;
  degree: Degree;
}

export interface AccreditaionExperience {
  slug: string;
  experience: Experience;
}

export interface AccreditaionTraining {
  slug: string;
  training: Training;
}

// AdminAccreditationRetrieve retourné par /api/administrations/accreditations/{slug}/
export interface AdminAccreditationRetrieve {
  slug: string;
  status: DemandStatus;
  submission_date: string | null;
  review_date: string | null;
  approval_date: string | null;
  rejection_date: string | null;
  reason_for_rejection: string | null;
  valid_from: string | null;
  valid_to: string | null;
  certificate_number: string | null;
  notes: string | null;
  entity: EntityDetail;
  representative: RepresentativeList;
  type_accreditation: string;
  accreditation_degree: AccreditationDegree[];
  accreditation_experience: AccreditaionExperience[];
  accreditation_training: AccreditaionTraining[];
}

export interface EntityList {
  slug: string;
  name: string;
  acronym?: string | null;
  business_sector?: string | null;
  entity_type: 'personal' | 'business' | 'ngo';
  is_active: boolean;
  status: EntityStatus;
  created_at: string;
}

export interface EntityDetail extends Entity {
  entity_users: EntityUser[];
  rejection_reason?: string | null;
  status: EntityStatus;
}

// EntityDetailAdmin retourné par /api/administrations/entities/{slug}/
export interface EntityDetailAdmin extends EntityDetail {
  representatives: RepresentativeList[];
  accreditations: AccreditationList[];
  documents: Document[];
}

export interface EntityUser {
  slug: string;
  user?: string | null;
  email: string;
  status: 'pending' | 'active' | 'blocked' | 'left' | 'declined';
  created_at: string;
}

export interface AccreditationDetail {
  slug: string;
  status: DemandStatus;
  type_accreditation: TypeAccreditation;
  representative: Representative;
  submission_date: string | null;
  review_date: string | null;
  approval_date: string | null;
  rejection_date: string | null;
  reason_for_rejection: string | null;
  valid_from: string | null;
  valid_to: string | null;
  certificate_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Types pour le dashboard admin
export interface LastAccreditation {
  slug: string;
  entity: string;
  representative: string;
  type_accreditation: string;
  status: DemandStatus;
  submission_date: string | null;
  review_date: string | null;
  approval_date: string | null;
}

export interface LastEntity {
  slug: string;
  name: string;
  acronym: string | null;
  business_sector: string | null;
  entity_type: 'personal' | 'business' | 'ngo';
  is_active: boolean;
  status: EntityStatus;
  created_at: string;
}

export interface AdminDashboardData {
  accreditations: {
    total: number;
    submitted: number;
    under_review: number;
    approved: number;
    rejected: number;
  };
  entity: {
    total: number;
    submitted: number;
    under_review: number;
    validated: number;
    blocked: number;
  };
  total_representative: number;
  last_accreditation: LastAccreditation[];
  last_entity: LastEntity[];
}

// Types pour User (admin)
export interface User {
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  url?: string;
  is_superuser: boolean;
  is_staff: boolean;
}

export interface UserList {
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
}

export interface UserUpdate {
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
}

export interface PaginatedUserList {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserList[];
}
