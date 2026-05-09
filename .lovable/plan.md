
# Quora-Style Community Q&A — Implementation Plan

The community becomes the main product. Anyone can browse; signing in unlocks asking, answering, commenting, voting, following, and reporting. Every post and answer has a per-item "Post anonymously" toggle.

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud and set up the schema below.

### Tables

- **profiles** — id (= auth.users.id), username (unique), display_name, avatar_url, bio, created_at. Auto-created via trigger on signup.
- **user_roles** — (user_id, role enum: `admin` | `moderator` | `user`). Separate table to avoid privilege escalation. `has_role()` security-definer function for RLS.
- **topics** — id, slug, name, description, icon, followers_count.
- **questions** — id, author_id, title, body (rich text), is_anonymous, status (`open`|`closed`|`removed`), views_count, answers_count, score, created_at.
- **question_topics** — (question_id, topic_id) join table.
- **answers** — id, question_id, author_id, body, is_anonymous, score, created_at, edited_at, status.
- **comments** — id, parent_type (`question`|`answer`|`comment`), parent_id, author_id, body, is_anonymous, created_at. Self-referential for nested replies.
- **votes** — (user_id, target_type `question`|`answer`|`comment`, target_id, value `1|-1`). Unique per (user, target).
- **follows_topic** — (user_id, topic_id).
- **follows_user** — (follower_id, followed_id).
- **reports** — id, reporter_id, target_type, target_id, reason, status (`pending`|`resolved`|`dismissed`), created_at.
- **notifications** — id, user_id, type (`new_answer`|`new_comment`|`vote`|`follow`|`mention`), payload jsonb, read_at, created_at.
- **blocked_words** — admin-managed list for the profanity filter.

### Security

- RLS enabled on all tables.
- Public SELECT on questions/answers/comments where `status='open'`. Author identity hidden in API responses when `is_anonymous=true` (server function strips author_id → returns "Anonymous").
- INSERT/UPDATE require `auth.uid() = author_id`.
- Votes: one per user per target (DB unique constraint), toggling updates `score` via trigger.
- Counters (`answers_count`, `score`, `followers_count`) maintained by Postgres triggers.
- Profanity filter runs server-side on insert; flagged content auto-creates a report.
- Admin/moderator routes gated by `has_role()`.

## 2. Routes (TanStack Start)

```
/community                    → feed (top/new tabs, topic filter sidebar)
/community/ask                → ask question form (login required)
/community/q/$questionId      → question detail + answers + comments
/community/q/$questionId/answer → write answer (login required)
/community/topics             → all topics
/community/topics/$slug       → topic feed + follow button
/community/u/$username        → public profile (questions, answers, followers)
/community/notifications      → notifications inbox (login required)
/login, /signup, /reset-password
/_authenticated/settings      → profile edit, account
/_authenticated/admin         → moderation dashboard (admin/mod only)
```

Browsing is fully public. `/_authenticated/*` uses TanStack's `beforeLoad` redirect guard. Posting actions on public pages open a "Sign in to continue" modal.

## 3. UI Components

- **QuestionCard** — title, snippet, author chip (or "Anonymous"), topic tags, vote count, answer count, time. Used in feeds.
- **QuestionDetail** — full question, vote arrows, follow button, share, report.
- **AnswerCard** — body, author/anonymous, vote arrows, comment toggle, expand/collapse long answers.
- **CommentThread** — nested comments (max depth 3), reply, vote, report.
- **AskQuestionForm** — title, rich-text body (Tiptap), topic multi-select with create-new, **"Post anonymously" switch**, submit.
- **AnswerEditor** — rich-text, anonymous switch.
- **VoteButtons** — up/down arrows with optimistic UI.
- **TopicChip / TopicHeader / FollowButton**.
- **NotificationBell** in header showing unread count.
- **ReportDialog** — reason dropdown + optional note.
- **AdminDashboard** — reports queue, remove/dismiss, user role management, blocked-words editor.
- **AnonymousBadge** — visual indicator (mask icon) so readers know identity is hidden.

Replace the current `CommunityQA` homepage section with a live preview pulling top/trending questions from the database, plus a prominent "Ask the Hive" CTA.

## 4. Server Functions (createServerFn)

- `listQuestions({ sort, topic, cursor })` — public, strips anonymous author_ids.
- `getQuestion(id)` + `listAnswers(questionId, sort)` + `listComments(parentType, parentId)`.
- `createQuestion`, `createAnswer`, `createComment` — auth required, run profanity filter, set `is_anonymous`.
- `vote(targetType, targetId, value)` — auth required, upserts/deletes.
- `followTopic`, `followUser`, `report`, `markNotificationRead`.
- `adminResolveReport`, `adminRemoveContent`, `adminSetRole` — admin-gated.

All anonymous content has author_id stripped before leaving the server, even from the author's own viewers (only the author themselves sees an "(posted anonymously)" hint on their own item via a separate `myActivity` function).

## 5. Moderation

- Report button on every question/answer/comment.
- Profanity filter using `blocked_words` table; matches block submission with an inline error or auto-flag for review (admin choice).
- Admin dashboard: pending reports queue, one-click remove (sets `status='removed'`), ban user (revoke role / mark profile), manage blocked words, promote moderators.
- Rate limiting per user (e.g., max 5 questions/hour) enforced in server functions.

## 6. Notifications

- DB triggers insert rows into `notifications` when: someone answers your question, comments on your answer, votes you up past thresholds, or follows you.
- Header bell polls unread count (or Supabase Realtime subscription for live updates).
- Notifications page lists items with deep links.

## 7. Homepage Integration

- Replace current static `CommunityQA.tsx` with a live "Hot Questions from the Hive" section (top 4 by score this week) + "Ask a question" CTA opening `/community/ask`.
- Add `/community` to header nav as the primary destination.

## 8. Phasing

1. **Foundation** — Cloud, auth (email + Google), profiles, roles, RLS, base routes, `/community` feed read-only.
2. **Core loop** — ask, answer, comment, vote, anonymous toggle, topics.
3. **Social** — profiles, follow user/topic, notifications.
4. **Moderation** — reports, profanity filter, admin dashboard, rate limits.
5. **Polish** — homepage live feed, share metadata per question (SEO), realtime updates.

## Technical Notes

- Auth: Email/password + Google via Lovable Cloud. Profile auto-created by `handle_new_user()` trigger.
- Anonymous enforcement is **server-side only** — never trust the client to hide author_id. A dedicated `serializeQuestion()` helper in a `*.server.ts` file owns this.
- Voting/counters via Postgres triggers to stay consistent under concurrency.
- Rich text: Tiptap (StarterKit + Link + Image) with sanitization on render via DOMPurify.
- SEO: each `/community/q/$id` route emits per-question `<title>`, description, and JSON-LD `QAPage` schema.
- Pagination: keyset (cursor on `created_at, id`) for infinite scroll.
