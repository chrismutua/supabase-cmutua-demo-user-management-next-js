## Summary

Trying out https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

## Tutorial path mapping (`src/`)

This project uses a `src/` directory, while the tutorial uses root-relative paths. Apply this mapping:

| Tutorial | In this repo |
| --- | --- |
| `app/login/page.tsx` | `src/app/login/page.tsx` |
| `app/login/actions.ts` | `src/app/login/actions.ts` |
| `app/auth/confirm/route.ts` | `src/app/auth/confirm/route.ts` |
| `app/account/page.tsx` | `src/app/account/page.tsx` |
| `app/account/account-form.tsx` | `src/app/account/account-form.tsx` |
| `app/account/avatar.tsx` | `src/app/account/avatar.tsx` |
| `lib/supabase/client.ts` | `src/lib/supabase/client.ts` |
| `lib/supabase/server.ts` | `src/lib/supabase/server.ts` |
| `lib/supabase/proxy.ts` | `src/lib/supabase/proxy.ts` |
| root `proxy.ts` | `src/proxy.ts` |
| `app/globals.css` | `src/app/globals.css` |

### Rules of thumb

- Every `app/...` becomes `src/app/...`.
- Every `lib/...` becomes `src/lib/...`.
- Root `proxy.ts` goes to `src/proxy.ts` — at the same level as `src/app`, **not** inside `src/app`.
- `public/`, `package.json`, `next.config.ts`, `tsconfig.json`, `.env.local`, and `supabase/` stay at the repo root.

The `@/*` alias maps to `./src/*`, so tutorial imports like `@/lib/supabase/client` work unchanged. Relative imports between `app/` and `lib/` also remain valid because both live under `src/`.

## Deploying to Supabase

Supabase hosts the database, auth, and storage. Deploying the Next.js app is separate; for production, set the same two `NEXT_PUBLIC_*` variables in your host (for example, Vercel).

### Apply the schema

The `supabase/migrations/` directory is the source of truth. A local database is not the cloud project.

From the repo root:

```bash
supabase login
supabase link --project-ref <project-ref>   # prompts for the database password
supabase db push --dry-run
supabase db push
supabase migration list --linked
```

Find `<project-ref>` in the dashboard project URL. Verify afterward:

- Table Editor → `profiles`
- Storage → `avatars`
- Database → Functions → `handle_new_user`

The `on_auth_user_created` trigger is attached to `auth.users`, so it does **not** appear under Database → Triggers. Check it with the SQL Editor:

```sql
select tgname from pg_trigger where tgname = 'on_auth_user_created';
```

Notes:

- Never run `supabase db reset` against the cloud project; it is local-only.
- Users created before the trigger existed have no profile. Saving the account form upserts one, or recreate the user.
- For schema changes: create a migration, test locally, commit, merge, then run `supabase db push` from `main`.
- `supabase link` writes only ignored state under `supabase/.temp/`.

### Auth URLs

Dashboard → **Authentication** → **URL Configuration**:
`https://supabase.com/dashboard/project/<project-ref>/auth/url-configuration`

- **Site URL**: `http://localhost:3000` for local testing, or your production URL when deployed.
- **Redirect URLs**: add `http://localhost:3000/**` and your production URL, e.g. `https://your-app.vercel.app/**`.

Then update **Authentication → Email Templates → Confirm signup** to:

`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

Site URL is a single value. If you use one cloud project for both local and production, switch it while developing or use separate projects.

### Environment variables

Local development uses `.env.local` (ignored):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Set the same two variables in your production host. Never commit `.env.local`. The Supabase example's `.env.production.example` is only a deployment template and is not required for this app.
