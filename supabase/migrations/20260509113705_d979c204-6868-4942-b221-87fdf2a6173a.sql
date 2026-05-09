
-- Enums
create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.content_status as enum ('open', 'closed', 'removed');
create type public.target_type as enum ('question', 'answer', 'comment');
create type public.report_status as enum ('pending', 'resolved', 'dismissed');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Roles viewable by self or admin" on public.user_roles for select
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_username text;
  final_username text;
  i int := 0;
begin
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1),
    'user'
  );
  base_username := regexp_replace(lower(base_username), '[^a-z0-9_]', '', 'g');
  if length(base_username) < 3 then base_username := 'user' || substr(new.id::text, 1, 6); end if;
  final_username := base_username;
  while exists(select 1 from public.profiles where username = final_username) loop
    i := i + 1;
    final_username := base_username || i::text;
  end loop;
  insert into public.profiles (id, username, display_name)
    values (new.id, final_username, coalesce(new.raw_user_meta_data->>'display_name', final_username));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Topics
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  followers_count int not null default 0,
  questions_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.topics enable row level security;
create policy "Topics viewable by everyone" on public.topics for select using (true);
create policy "Authenticated users create topics" on public.topics for insert
  with check (auth.uid() is not null);
create policy "Admins update topics" on public.topics for update
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Admins delete topics" on public.topics for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Questions
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(title) between 10 and 300),
  body text not null default '',
  is_anonymous boolean not null default false,
  status content_status not null default 'open',
  views_count int not null default 0,
  answers_count int not null default 0,
  comments_count int not null default 0,
  score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index questions_created_idx on public.questions (created_at desc);
create index questions_score_idx on public.questions (score desc, created_at desc);
alter table public.questions enable row level security;

create policy "Open questions viewable by everyone" on public.questions for select
  using (status <> 'removed' or auth.uid() = author_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authenticated users create questions" on public.questions for insert
  with check (auth.uid() = author_id);
create policy "Authors update own questions" on public.questions for update
  using (auth.uid() = author_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authors delete own questions" on public.questions for delete
  using (auth.uid() = author_id or public.has_role(auth.uid(), 'admin'));

-- Question/topic join
create table public.question_topics (
  question_id uuid not null references public.questions(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  primary key (question_id, topic_id)
);
alter table public.question_topics enable row level security;
create policy "QT viewable by everyone" on public.question_topics for select using (true);
create policy "Authors manage own QT" on public.question_topics for all
  using (exists(select 1 from public.questions q where q.id = question_id and (q.author_id = auth.uid() or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))))
  with check (exists(select 1 from public.questions q where q.id = question_id and q.author_id = auth.uid()));

-- Answers
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) between 1 and 50000),
  is_anonymous boolean not null default false,
  status content_status not null default 'open',
  score int not null default 0,
  comments_count int not null default 0,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  updated_at timestamptz not null default now()
);
create index answers_q_idx on public.answers (question_id, score desc, created_at desc);
alter table public.answers enable row level security;

create policy "Answers viewable by everyone" on public.answers for select
  using (status <> 'removed' or auth.uid() = author_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authenticated users create answers" on public.answers for insert
  with check (auth.uid() = author_id);
create policy "Authors update own answers" on public.answers for update
  using (auth.uid() = author_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authors delete own answers" on public.answers for delete
  using (auth.uid() = author_id or public.has_role(auth.uid(), 'admin'));

-- Comments (nestable)
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  parent_type target_type not null,
  parent_id uuid not null,
  reply_to_comment_id uuid references public.comments(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) between 1 and 5000),
  is_anonymous boolean not null default false,
  status content_status not null default 'open',
  score int not null default 0,
  created_at timestamptz not null default now()
);
create index comments_parent_idx on public.comments (parent_type, parent_id, created_at);
alter table public.comments enable row level security;

create policy "Comments viewable by everyone" on public.comments for select
  using (status <> 'removed' or auth.uid() = author_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authenticated users create comments" on public.comments for insert
  with check (auth.uid() = author_id);
create policy "Authors update own comments" on public.comments for update
  using (auth.uid() = author_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authors delete own comments" on public.comments for delete
  using (auth.uid() = author_id or public.has_role(auth.uid(), 'admin'));

-- Votes
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type target_type not null,
  target_id uuid not null,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);
create index votes_target_idx on public.votes (target_type, target_id);
alter table public.votes enable row level security;
create policy "Votes viewable by everyone" on public.votes for select using (true);
create policy "Users manage own votes" on public.votes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Follows
create table public.follows_topic (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);
alter table public.follows_topic enable row level security;
create policy "Topic follows viewable by everyone" on public.follows_topic for select using (true);
create policy "Users manage own topic follows" on public.follows_topic for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.follows_user (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followed_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);
alter table public.follows_user enable row level security;
create policy "User follows viewable by everyone" on public.follows_user for select using (true);
create policy "Users manage own user follows" on public.follows_user for all
  using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type target_type not null,
  target_id uuid not null,
  reason text not null,
  note text,
  status report_status not null default 'pending',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id)
);
alter table public.reports enable row level security;
create policy "Reporters or mods view reports" on public.reports for select
  using (auth.uid() = reporter_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Authenticated users create reports" on public.reports for insert
  with check (auth.uid() = reporter_id);
create policy "Mods update reports" on public.reports for update
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Blocked words
create table public.blocked_words (
  id uuid primary key default gen_random_uuid(),
  word text unique not null,
  created_at timestamptz not null default now()
);
alter table public.blocked_words enable row level security;
create policy "Blocked words viewable by mods" on public.blocked_words for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "Admins manage blocked words" on public.blocked_words for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Profanity check function (server-side use via RPC)
create or replace function public.contains_blocked_word(_text text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.blocked_words
    where position(lower(word) in lower(_text)) > 0
  )
$$;

-- Trigger: maintain vote score on questions/answers/comments
create or replace function public.apply_vote_delta(_target_type target_type, _target_id uuid, _delta int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if _target_type = 'question' then
    update public.questions set score = score + _delta where id = _target_id;
  elsif _target_type = 'answer' then
    update public.answers set score = score + _delta where id = _target_id;
  elsif _target_type = 'comment' then
    update public.comments set score = score + _delta where id = _target_id;
  end if;
end; $$;

create or replace function public.handle_vote_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform public.apply_vote_delta(new.target_type, new.target_id, new.value);
  elsif tg_op = 'UPDATE' then
    perform public.apply_vote_delta(old.target_type, old.target_id, -old.value);
    perform public.apply_vote_delta(new.target_type, new.target_id, new.value);
  elsif tg_op = 'DELETE' then
    perform public.apply_vote_delta(old.target_type, old.target_id, -old.value);
  end if;
  return coalesce(new, old);
end; $$;

create trigger votes_score_trg
  after insert or update or delete on public.votes
  for each row execute function public.handle_vote_change();

-- Trigger: maintain answers_count + notify on new answer
create or replace function public.handle_answer_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare q_author uuid;
begin
  if tg_op = 'INSERT' then
    update public.questions set answers_count = answers_count + 1 where id = new.question_id;
    select author_id into q_author from public.questions where id = new.question_id;
    if q_author is not null and q_author <> new.author_id then
      insert into public.notifications (user_id, type, payload)
        values (q_author, 'new_answer',
          jsonb_build_object('question_id', new.question_id, 'answer_id', new.id, 'is_anonymous', new.is_anonymous));
    end if;
  elsif tg_op = 'DELETE' then
    update public.questions set answers_count = greatest(answers_count - 1, 0) where id = old.question_id;
  end if;
  return coalesce(new, old);
end; $$;

create trigger answers_count_trg
  after insert or delete on public.answers
  for each row execute function public.handle_answer_change();

-- Trigger: comments counts + notify
create or replace function public.handle_comment_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare recipient uuid;
begin
  if tg_op = 'INSERT' then
    if new.parent_type = 'question' then
      update public.questions set comments_count = comments_count + 1 where id = new.parent_id;
      select author_id into recipient from public.questions where id = new.parent_id;
    elsif new.parent_type = 'answer' then
      update public.answers set comments_count = comments_count + 1 where id = new.parent_id;
      select author_id into recipient from public.answers where id = new.parent_id;
    end if;
    if recipient is not null and recipient <> new.author_id then
      insert into public.notifications (user_id, type, payload)
        values (recipient, 'new_comment',
          jsonb_build_object('comment_id', new.id, 'parent_type', new.parent_type, 'parent_id', new.parent_id));
    end if;
  elsif tg_op = 'DELETE' then
    if old.parent_type = 'question' then
      update public.questions set comments_count = greatest(comments_count - 1, 0) where id = old.parent_id;
    elsif old.parent_type = 'answer' then
      update public.answers set comments_count = greatest(comments_count - 1, 0) where id = old.parent_id;
    end if;
  end if;
  return coalesce(new, old);
end; $$;

create trigger comments_count_trg
  after insert or delete on public.comments
  for each row execute function public.handle_comment_change();

-- Trigger: topic counts
create or replace function public.handle_question_topic_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.topics set questions_count = questions_count + 1 where id = new.topic_id;
  elsif tg_op = 'DELETE' then
    update public.topics set questions_count = greatest(questions_count - 1, 0) where id = old.topic_id;
  end if;
  return coalesce(new, old);
end; $$;

create trigger qt_count_trg
  after insert or delete on public.question_topics
  for each row execute function public.handle_question_topic_change();

create or replace function public.handle_topic_follow_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.topics set followers_count = followers_count + 1 where id = new.topic_id;
  elsif tg_op = 'DELETE' then
    update public.topics set followers_count = greatest(followers_count - 1, 0) where id = old.topic_id;
  end if;
  return coalesce(new, old);
end; $$;

create trigger topic_follow_trg
  after insert or delete on public.follows_topic
  for each row execute function public.handle_topic_follow_change();

-- Notify on follow
create or replace function public.handle_user_follow_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, type, payload)
    values (new.followed_id, 'follow', jsonb_build_object('follower_id', new.follower_id));
  return new;
end; $$;

create trigger user_follow_notify_trg
  after insert on public.follows_user
  for each row execute function public.handle_user_follow_insert();

-- updated_at maintenance
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

create trigger questions_touch before update on public.questions
  for each row execute function public.touch_updated_at();
create trigger answers_touch before update on public.answers
  for each row execute function public.touch_updated_at();

-- Seed topics
insert into public.topics (slug, name, description, icon) values
  ('chatgpt', 'ChatGPT', 'Tips, prompts, and questions about OpenAI ChatGPT', '🤖'),
  ('claude', 'Claude', 'Discussion about Anthropic Claude', '🧠'),
  ('midjourney', 'Midjourney', 'AI image generation with Midjourney', '🎨'),
  ('productivity', 'Productivity', 'Use AI to get more done', '⚡'),
  ('beginners', 'Beginners', 'Just starting out with AI', '🐝'),
  ('prompts', 'Prompts', 'Prompt engineering tips and tricks', '✍️'),
  ('coding', 'Coding with AI', 'AI for software development', '💻'),
  ('design', 'AI for Design', 'Creative AI workflows', '🖼️');
