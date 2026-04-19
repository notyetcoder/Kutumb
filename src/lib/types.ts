/**
 * Core Type Definitions
 * Used throughout the Kutumb application
 */

export type Gender = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'widowed';
export type Language = 'gujarati' | 'hindi' | 'english';

export interface User {
  id: string;
  name: string;
  surname: string;
  maidenName?: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  fatherId?: string | null;
  motherId?: string | null;
  spouseId?: string | null;
  birthMonth?: string;
  birthYear?: string;
  profilePictureUrl?: string;
  description?: string;
  isDeceased?: boolean;
  deathDate?: string;
  family?: string;
  created_at?: string;
  isDeleted?: boolean;
}

export interface RelationshipResult {
  found: boolean;
  relationship?: string;
  explanation?: string;
  path?: Array<{ id: string; name: string }>;
  distance?: number;
}

export interface RelationshipTranslation {
  gujarati: string;
  hindi: string;
  english: string;
  category: 'basic' | 'grandparent' | 'grandchild' | 'uncle-aunt' | 'cousin' | 'in-laws';
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}
