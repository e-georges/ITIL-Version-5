// Contrats TypeScript manuels reflétant le schéma SQL (0001-0003).
// À terme, remplacer/compléter via : npm run db:types
// (nécessite `supabase` CLI et l'ID du projet une fois Supabase créé).

export type UserRole = "parent" | "child";
export type SourceType = "official" | "user_added";
export type ContentTier = "empty" | "generic" | "authoritative";
export type InputType = "manual" | "photo" | "url";
export type Language = "fr" | "en" | "es";
export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "qcm" | "true_false" | "short_answer" | "open_answer";

export interface CurriculumSubject {
  id: string;
  name: string;
  color: string;
  level: string;
}

export interface CurriculumChapter {
  id: string;
  curriculum_subject_id: string;
  title: string;
  order_index: number;
  generic_summary: string | null;
}

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
}

export interface Family {
  id: string;
  name: string | null;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
}

export interface Subject {
  id: string;
  child_id: string;
  curriculum_subject_id: string | null;
  name: string;
  color: string;
  is_official: boolean;
  created_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  curriculum_chapter_id: string | null;
  title: string;
  order_index: number;
  source_type: SourceType;
  content_tier: ContentTier;
  created_at: string;
}

export interface Course {
  id: string;
  chapter_id: string;
  title: string;
  content: string;
  language: Language;
  created_at: string;
}

export interface ContentSource {
  id: string;
  course_id: string;
  input_type: InputType;
  source_url: string | null;
  raw_image_deleted_at: string | null;
  created_at: string;
}

export interface StudyCard {
  id: string;
  course_id: string;
  summary_short: string | null;
  summary_full: string | null;
  key_concepts: string[] | null;
  pitfalls: string[] | null;
  exam_sheet: string | null;
  generated_at: string;
}

export interface Flashcard {
  id: string;
  course_id: string;
  front: string;
  back: string;
}

export interface Question {
  id: string;
  course_id: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  answer: string;
  explanation: string | null;
  unlock_threshold: number;
}

export interface Review {
  id: string;
  child_id: string;
  course_id: string;
  question_id: string | null;
  score: number | null;
  duration_seconds: number | null;
  review_date: string;
}

export interface ReviewSchedule {
  id: string;
  course_id: string;
  next_review: string;
  mastery: number;
  interval_days: number;
  updated_at: string;
}

// Type Supabase générique minimal (suffisant pour createBrowserClient/createServerClient
// tant que les types générés automatiquement ne sont pas encore branchés).
export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown> }>;
  };
};
