-- ============================================================
-- 0002 — ROW LEVEL SECURITY
-- ============================================================
-- Principe : un enfant et ses parents partagent la même "family".
-- Toute donnée scolaire n'est visible/modifiable que par les membres
-- de la famille de l'enfant concerné. Le référentiel curriculum est
-- public en lecture (mutualisé), jamais modifiable depuis le client.

-- ---------- Fonctions utilitaires ----------

create or replace function is_same_family(target_user_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from family_members fm1
    join family_members fm2 on fm1.family_id = fm2.family_id
    where fm1.user_id = auth.uid()
      and fm2.user_id = target_user_id
  );
$$;

create or replace function chapter_child_id(p_chapter_id uuid)
returns uuid
language sql
stable
as $$
  select s.child_id
  from chapters c
  join subjects s on s.id = c.subject_id
  where c.id = p_chapter_id;
$$;

create or replace function course_child_id(p_course_id uuid)
returns uuid
language sql
stable
as $$
  select chapter_child_id(chapter_id) from courses where id = p_course_id;
$$;

-- ---------- Référentiel curriculum (lecture publique, écriture backend uniquement) ----------

alter table curriculum_subjects enable row level security;
alter table curriculum_chapters enable row level security;

create policy "curriculum readable by authenticated users" on curriculum_subjects
  for select using (auth.role() = 'authenticated');

create policy "curriculum chapters readable by authenticated users" on curriculum_chapters
  for select using (auth.role() = 'authenticated');

-- Aucune policy insert/update/delete : seules les clés service_role (backend) peuvent écrire.

-- ---------- Utilisateurs & famille ----------

alter table users enable row level security;
alter table families enable row level security;
alter table family_members enable row level security;

create policy "view own and family users" on users
  for select using (id = auth.uid() or is_same_family(id));

create policy "update own user" on users
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "insert own user" on users
  for insert with check (id = auth.uid());

create policy "view own family" on families
  for select using (
    exists (select 1 from family_members fm where fm.family_id = families.id and fm.user_id = auth.uid())
  );

create policy "create own family" on families
  for insert with check (auth.role() = 'authenticated');

create policy "view family membership" on family_members
  for select using (
    exists (select 1 from family_members fm2 where fm2.family_id = family_members.family_id and fm2.user_id = auth.uid())
  );

create policy "join family as self" on family_members
  for insert with check (user_id = auth.uid());

-- ---------- Structure pédagogique (scoping famille) ----------

alter table subjects enable row level security;
create policy "family access subjects" on subjects
  for all using (is_same_family(child_id)) with check (is_same_family(child_id));

alter table chapters enable row level security;
create policy "family access chapters" on chapters
  for all using (is_same_family(chapter_child_id(id))) with check (
    is_same_family((select child_id from subjects where id = subject_id))
  );

alter table courses enable row level security;
create policy "family access courses" on courses
  for all using (is_same_family(course_child_id(id))) with check (
    is_same_family(chapter_child_id(chapter_id))
  );

alter table content_sources enable row level security;
create policy "family access content_sources" on content_sources
  for all using (is_same_family(course_child_id(course_id))) with check (
    is_same_family(course_child_id(course_id))
  );

-- ---------- Contenu généré par IA ----------

alter table study_cards enable row level security;
create policy "family access study_cards" on study_cards
  for all using (is_same_family(course_child_id(course_id))) with check (
    is_same_family(course_child_id(course_id))
  );

alter table flashcards enable row level security;
create policy "family access flashcards" on flashcards
  for all using (is_same_family(course_child_id(course_id))) with check (
    is_same_family(course_child_id(course_id))
  );

alter table questions enable row level security;
create policy "family access questions" on questions
  for all using (is_same_family(course_child_id(course_id))) with check (
    is_same_family(course_child_id(course_id))
  );

-- ---------- Révision & suivi ----------

alter table reviews enable row level security;
create policy "family access reviews" on reviews
  for all using (is_same_family(child_id)) with check (is_same_family(child_id));

alter table review_schedule enable row level security;
create policy "family access review_schedule" on review_schedule
  for all using (is_same_family(course_child_id(course_id))) with check (
    is_same_family(course_child_id(course_id))
  );
