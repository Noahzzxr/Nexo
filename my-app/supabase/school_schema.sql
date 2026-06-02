create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  fullname text not null,
  email text unique not null,
  cpf text unique,
  registration_number text unique,
  role text not null check (role in ('student', 'teacher', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school_year text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  student_id uuid references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, class_id)
);

create table if not exists public.teacher_subjects (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (teacher_id, class_id, subject_id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  file_attachment_url text,
  due_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.student_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  photo_delivery_url text,
  submitted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'completed', 'late'))
);

create table if not exists public.grades (
  student_id uuid references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  note_p1 numeric(4, 2) default 0,
  note_p2 numeric(4, 2) default 0,
  note_p3 numeric(4, 2) default 0,
  final_grade numeric(4, 2) default 0,
  total_absences integer default 0,
  updated_at timestamptz not null default now(),
  primary key (student_id, subject_id, class_id)
);

create table if not exists public.attendance_records (
  student_id uuid references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  month_label text not null,
  presence_rate numeric(5, 2) not null,
  updated_at timestamptz not null default now(),
  primary key (student_id, class_id, month_label)
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade,
  title text not null,
  event_type text not null check (event_type in ('exam', 'activity', 'holiday')),
  start_date timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigserial primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads_inscription (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  cpf text,
  desired_course text,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  registration_number text unique,
  institutional_email text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.posted_materials (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  title text not null,
  description text,
  file_attachment_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question_text text not null,
  options text[] not null,
  correct_option integer not null,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.approve_lead(
  lead_id uuid,
  generated_email text,
  generated_registration text,
  generated_password text
)
returns table (
  auth_user_id uuid,
  id uuid,
  full_name text,
  initial_password text,
  status text,
  institutional_email text,
  registration_number text
)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  new_user_id uuid := gen_random_uuid();
  lead_record public.leads_inscription%rowtype;
begin
  if public.current_user_role() <> 'admin' then
    raise exception 'only admins can approve leads';
  end if;

  select * into lead_record
    from public.leads_inscription
   where public.leads_inscription.id = lead_id
   for update;

  if lead_record.id is null then
    raise exception 'lead not found';
  end if;

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    generated_email,
    crypt(generated_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('fullname', lead_record.full_name, 'role', 'student'),
    now(),
    now()
  )
  on conflict (email) do update set updated_at = now()
  returning auth.users.id into new_user_id;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    new_user_id::text,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', generated_email),
    'email',
    generated_email,
    now(),
    now(),
    now()
  )
  on conflict (provider, provider_id) do nothing;

  insert into public.profiles (
    id,
    fullname,
    email,
    cpf,
    registration_number,
    role
  )
  values (
    new_user_id,
    lead_record.full_name,
    generated_email,
    lead_record.cpf,
    generated_registration,
    'student'
  )
  on conflict (id) do update set
    fullname = excluded.fullname,
    email = excluded.email,
    cpf = excluded.cpf,
    registration_number = excluded.registration_number,
    role = excluded.role;

  update public.leads_inscription
     set status = 'approved',
         institutional_email = generated_email,
         registration_number = generated_registration
   where public.leads_inscription.id = lead_id;

  return query
    select
      new_user_id,
      lead_record.id,
      lead_record.full_name,
      generated_password,
      'approved'::text,
      generated_email,
      generated_registration;
end;
$$;

grant execute on function public.approve_lead(uuid, text, text, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.enrollments enable row level security;
alter table public.teacher_subjects enable row level security;
alter table public.assignments enable row level security;
alter table public.student_submissions enable row level security;
alter table public.grades enable row level security;
alter table public.attendance_records enable row level security;
alter table public.calendar_events enable row level security;
alter table public.messages enable row level security;
alter table public.leads_inscription enable row level security;
alter table public.posted_materials enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists profiles_self_read_update on public.profiles;
create policy profiles_self_read_update on public.profiles
  for select using (id = auth.uid() or public.current_user_role() in ('teacher', 'admin'));

drop policy if exists classes_admin_all on public.classes;
create policy classes_admin_all on public.classes
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists classes_read_authenticated on public.classes;
create policy classes_read_authenticated on public.classes
  for select using (auth.uid() is not null);

drop policy if exists subjects_admin_all on public.subjects;
create policy subjects_admin_all on public.subjects
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists subjects_read_authenticated on public.subjects;
create policy subjects_read_authenticated on public.subjects
  for select using (auth.uid() is not null);

drop policy if exists enrollments_admin_all on public.enrollments;
create policy enrollments_admin_all on public.enrollments
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists enrollments_student_read on public.enrollments;
create policy enrollments_student_read on public.enrollments
  for select using (student_id = auth.uid() or public.current_user_role() in ('teacher', 'admin'));

drop policy if exists teacher_subjects_admin_all on public.teacher_subjects;
create policy teacher_subjects_admin_all on public.teacher_subjects
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists teacher_subjects_teacher_read on public.teacher_subjects;
create policy teacher_subjects_teacher_read on public.teacher_subjects
  for select using (teacher_id = auth.uid() or public.current_user_role() in ('teacher', 'admin'));

drop policy if exists assignments_admin_all on public.assignments;
create policy assignments_admin_all on public.assignments
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists assignments_teacher_write on public.assignments;
create policy assignments_teacher_write on public.assignments
  for insert with check (public.current_user_role() = 'teacher');

drop policy if exists assignments_teacher_update on public.assignments;
create policy assignments_teacher_update on public.assignments
  for update using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists assignments_student_read on public.assignments;
create policy assignments_student_read on public.assignments
  for select using (
    public.current_user_role() in ('teacher', 'admin')
    or exists (
      select 1 from public.enrollments e
      where e.student_id = auth.uid()
        and e.class_id = assignments.class_id
    )
  );

drop policy if exists submissions_admin_all on public.student_submissions;
create policy submissions_admin_all on public.student_submissions
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists submissions_student_insert on public.student_submissions;
create policy submissions_student_insert on public.student_submissions
  for insert with check (student_id = auth.uid() and public.current_user_role() = 'student');

drop policy if exists submissions_student_read on public.student_submissions;
create policy submissions_student_read on public.student_submissions
  for select using (student_id = auth.uid() or public.current_user_role() in ('teacher', 'admin'));

drop policy if exists submissions_teacher_update on public.student_submissions;
create policy submissions_teacher_update on public.student_submissions
  for update using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists grades_admin_all on public.grades;
create policy grades_admin_all on public.grades
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists grades_teacher_write on public.grades;
create policy grades_teacher_write on public.grades
  for all using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists grades_student_read on public.grades;
create policy grades_student_read on public.grades
  for select using (student_id = auth.uid() or public.current_user_role() in ('teacher', 'admin'));

drop policy if exists attendance_admin_all on public.attendance_records;
create policy attendance_admin_all on public.attendance_records
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists attendance_teacher_write on public.attendance_records;
create policy attendance_teacher_write on public.attendance_records
  for all using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists attendance_student_read on public.attendance_records;
create policy attendance_student_read on public.attendance_records
  for select using (student_id = auth.uid() or public.current_user_role() in ('teacher', 'admin'));

drop policy if exists events_admin_all on public.calendar_events;
create policy events_admin_all on public.calendar_events
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists events_teacher_write on public.calendar_events;
create policy events_teacher_write on public.calendar_events
  for insert with check (public.current_user_role() = 'teacher');

drop policy if exists events_teacher_update on public.calendar_events;
create policy events_teacher_update on public.calendar_events
  for update using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists events_read_authenticated on public.calendar_events;
create policy events_read_authenticated on public.calendar_events
  for select using (auth.uid() is not null);

drop policy if exists messages_private_select on public.messages;
create policy messages_private_select on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id or public.current_user_role() = 'admin');

drop policy if exists messages_private_insert on public.messages;
create policy messages_private_insert on public.messages
  for insert with check (auth.uid() = sender_id);

drop policy if exists leads_admin_all on public.leads_inscription;
create policy leads_admin_all on public.leads_inscription
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists leads_public_insert on public.leads_inscription;
create policy leads_public_insert on public.leads_inscription
  for insert with check (true);

drop policy if exists posted_materials_admin_all on public.posted_materials;
create policy posted_materials_admin_all on public.posted_materials
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists posted_materials_teacher_write on public.posted_materials;
create policy posted_materials_teacher_write on public.posted_materials
  for all using (teacher_id = auth.uid() or public.current_user_role() = 'teacher')
  with check (teacher_id = auth.uid() and public.current_user_role() = 'teacher');

drop policy if exists posted_materials_student_read on public.posted_materials;
create policy posted_materials_student_read on public.posted_materials
  for select using (
    public.current_user_role() in ('teacher', 'admin')
    or exists (
      select 1 from public.enrollments e
      where e.student_id = auth.uid()
        and e.class_id = posted_materials.class_id
    )
  );

drop policy if exists quizzes_admin_all on public.quizzes;
create policy quizzes_admin_all on public.quizzes
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists quizzes_teacher_write on public.quizzes;
create policy quizzes_teacher_write on public.quizzes
  for all using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists quizzes_student_read_by_class_subject on public.quizzes;
create policy quizzes_student_read_by_class_subject on public.quizzes
  for select using (
    public.current_user_role() in ('teacher', 'admin')
    or exists (
      select 1
        from public.enrollments e
        join public.teacher_subjects ts on ts.class_id = e.class_id
       where e.student_id = auth.uid()
         and ts.subject_id = quizzes.subject_id
    )
  );

drop policy if exists quiz_questions_admin_all on public.quiz_questions;
create policy quiz_questions_admin_all on public.quiz_questions
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists quiz_questions_teacher_write on public.quiz_questions;
create policy quiz_questions_teacher_write on public.quiz_questions
  for all using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

drop policy if exists quiz_questions_student_read on public.quiz_questions;
create policy quiz_questions_student_read on public.quiz_questions
  for select using (
    public.current_user_role() in ('teacher', 'admin')
    or exists (
      select 1
        from public.quizzes q
        join public.enrollments e on e.student_id = auth.uid()
        join public.teacher_subjects ts on ts.class_id = e.class_id and ts.subject_id = q.subject_id
       where q.id = quiz_questions.quiz_id
    )
  );

insert into storage.buckets (id, name, public)
values ('school-attachments', 'school-attachments', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists attachments_admin_all on storage.objects;
create policy attachments_admin_all on storage.objects
  for all using (bucket_id = 'school-attachments' and public.current_user_role() = 'admin')
  with check (bucket_id = 'school-attachments' and public.current_user_role() = 'admin');

drop policy if exists attachments_teacher_student_insert on storage.objects;
create policy attachments_teacher_student_insert on storage.objects
  for insert with check (
    bucket_id = 'school-attachments'
    and public.current_user_role() in ('student', 'teacher')
  );

drop policy if exists attachments_authenticated_read on storage.objects;
create policy attachments_authenticated_read on storage.objects
  for select using (bucket_id = 'school-attachments' and auth.uid() is not null);

grant usage on schema public to anon, authenticated;
grant insert on public.leads_inscription to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
