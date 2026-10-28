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
