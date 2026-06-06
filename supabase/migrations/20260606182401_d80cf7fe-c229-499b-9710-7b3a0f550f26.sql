
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'question'
  CHECK (kind IN ('question','prompt'));

CREATE INDEX IF NOT EXISTS questions_kind_score_idx ON public.questions (kind, score DESC);
CREATE INDEX IF NOT EXISTS questions_kind_created_idx ON public.questions (kind, created_at DESC);

INSERT INTO public.topics (slug, name, description, icon)
VALUES
  ('prompt-writing', 'Writing Prompts', 'Prompts for blogs, copy, fiction & editing', '✍️'),
  ('prompt-career', 'Career Prompts', 'Job hunt, resume, interview, growth', '💼'),
  ('prompt-learning', 'Learning Prompts', 'Study, explain-like-I''m-12, summarize', '🎓'),
  ('prompt-marketing', 'Marketing Prompts', 'Ads, social, SEO, email', '📣'),
  ('prompt-coding', 'Coding Prompts', 'Debug, refactor, scaffold, explain code', '💻'),
  ('prompt-productivity', 'Productivity Prompts', 'Planning, automation, second-brain', '⚡'),
  ('prompt-design', 'Design Prompts', 'Midjourney, DALL·E, brand, UI', '🎨'),
  ('prompt-daily', 'Daily Life Prompts', 'Meals, travel, finance, wellness', '🏠')
ON CONFLICT (slug) DO NOTHING;
