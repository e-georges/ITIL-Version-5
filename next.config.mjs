-- ============================================================
-- 0001 — SCHÉMA INITIAL RÉVISIO
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================
-- RÉFÉRENTIEL CURRICULUM (statique, mutualisé entre tous les utilisateurs)
-- ============================================
-- Note : remplace la table "generic_chapter_content" du document d'architecture.
-- Le résumé générique vit directement sur le chapitre de référence, ce qui évite
-- une jointure supplémentaire et clarifie le fait que ce contenu n'appartient
-- à aucun enfant en particulier.

create table curriculum_subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null,
  level text not null default 'seconde_generale'
);

create table curriculum_chapters (
  id uuid primary key default gen_random_uuid(),
  curriculum_subject_id uuid references curriculum_subjects(id) on delete cascade,
  title text not null,
  order_index int not null,
  generic_summary text
);

-- ============================================
-- UTILISATEURS & FAMILLE
-- ============================================

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('parent', 'child')),
  display_name text,
  created_at timestamptz default now()
);

create table families (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz default now()
);

create table family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  unique (family_id, user_id)
);

-- ============================================
-- STRUCTURE PÉDAGOGIQUE (propre à chaque enfant)
-- ============================================

create table subjects (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references users(id) on delete cascade,
  curriculum_subject_id uuid references curriculum_subjects(id),
  name text not null,
  color text not null,
  is_official boolean default true,
  created_at timestamptz default now()
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade,
  curriculum_chapter_id uuid references curriculum_chapters(id),
  title text not null,
  order_index int not null,
  source_type text not null check (source_type in ('official', 'user_added')),
  content_tier text not null default 'empty'
    check (content_tier in ('empty', 'generic', 'authoritative')),
  created_at timestamptz default now()
);

-- ============================================
-- COURS RÉEL DE L'ÉLÈVE (contenu "autoritaire")
-- ============================================

create table courses (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  title text not null,
  content text not null,
  language text not null default 'fr' check (language in ('fr', 'en', 'es')),
  created_at timestamptz default now()
);

-- Traçabilité du canal d'ajout (manuel V1, photo V1.1, url V1.2)
create table content_sources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  input_type text not null check (input_type in ('manual', 'photo', 'url')),
  source_url text,
  raw_image_deleted_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- CONTENU GÉNÉRÉ PAR IA
-- ============================================

create table study_cards (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade unique,
  summary_short text,
  summary_full text,
  key_concepts jsonb,
  pitfalls jsonb,
  exam_sheet text,
  generated_at timestamptz default now()
);

create table flashcards (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  front text not null,
  back text not null
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  type text not null check (type in ('qcm', 'true_false', 'short_answer', 'open_answer')),
  question text not null,
  answer text not null,
  explanation text,
  unlock_threshold int not null default 0
);

-- ============================================
-- RÉVISION & SUIVI
-- ============================================

create table reviews (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  question_id uuid references questions(id),
  score int,
  duration_seconds int,
  review_date timestamptz default now()
);

create table review_schedule (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade unique,
  next_review date not null,
  mastery int not null default 0 check (mastery between 0 and 100),
  interval_days int not null default 1,
  updated_at timestamptz default now()
);

-- Index utiles dès la V1
create index idx_chapters_subject on chapters(subject_id);
create index idx_courses_chapter on courses(chapter_id);
create index idx_questions_course on questions(course_id);
create index idx_reviews_child on reviews(child_id);
create index idx_review_schedule_next on review_schedule(next_review);
