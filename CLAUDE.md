# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working with the user

- The user writes in a mix of Turkish and English; both are fine. Respond in whichever language they use (in the backend repo they work in Turkish).
- Related repos live as siblings of this one: the backend API is at `../geziekibi-backend` (the API this frontend calls via `NEXT_PUBLIC_BACKEND_URL`), and the public-facing site is at `../geziekibi-website`. When an API contract question comes up, the source of truth is the backend repo.

## Commands

- `npm run dev` — start dev server on port 3004
- `npm run build` — production build
- `npm run start` — serve production build on port 3003
- `npm run lint` — run Next.js ESLint

There is no test setup in this project.

Requires `.env.local` with `NEXT_PUBLIC_BACKEND_URL` pointing at the backend API.

## What this is

Admin panel (CMS) for the "geziekibi" travel agency site: manages tours, blogs, tags, catalogs, documents, static pages, FAQs, homepage sliders, contact forms, email templates, and users. Next.js 14 App Router + TypeScript, built on a Bootstrap/reactstrap admin template (much of `src/Components`, `src/Layout`, `src/Data`, and `src/Redux` is template scaffolding — theme customizer, layout slices, demo data).

## Architecture

Each feature follows the same vertical slice; use an existing feature (e.g. `documents`/`Document`, or `tour`) as the reference when adding a new one:

1. **API calls** — `src/app/actions/<feature>/*.ts`, one file per endpoint call. Despite living under `app/actions`, these are NOT Next.js server actions; they run client-side and read the JWT from the `token` cookie via `js-cookie`. All go through `apiRequest`/`apiRequestFile` in `src/utils/ApiRequest.ts`, which prefixes `NEXT_PUBLIC_BACKEND_URL`, attaches the Bearer token, and auto-switches between JSON and FormData bodies.
2. **Response types** — `src/Types/ApiResponseType.ts`. `apiRequest` returns `ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>`; callers discriminate by checking for error fields (`errorType`/`errorMessage`) before using `data`.
3. **UI components** — `src/Components/<Feature>/` (client components, reactstrap-based).
4. **Route** — `src/app/(Mainbody)/<feature>/page.tsx`, usually a thin wrapper that renders the container component. The `(Mainbody)` route group's client layout provides Header/SideBar/Footer/ThemeCustomizer and a `@modal` parallel route slot.
5. **Sidebar entry** — `src/Data/Layout/Menu.tsx` (`MenuList`).

Cross-cutting pieces:

- **Auth**: `src/middleware.tsx` guards every non-`/auth` route by decoding the `token` cookie JWT and checking expiry; unauthenticated users go to `/auth/login`, authenticated users hitting `/auth/*` go to `/tour/add-tour`. `next.config.js` redirects `/` to `/auth/login`.
- **Form validation**: zod schemas live in `src/app/lib/definitions.ts`, shared enums (publish status, language, tour type, etc.) in `src/app/lib/enums.ts`. `src/utils/ValidateForm.ts` and `MapZodErrorsToApiErrors.ts` bridge zod errors to the API error shape.
- **i18n**: i18next with locale JSON in `src/app/i18n/locales/<lng>/common.json`. Fallback language is `tr` (`src/app/i18n/settings.tsx`); `en` and `tr` are the actively maintained locales — add new UI strings to both.
- **State**: Redux Toolkit store in `src/Redux` (with redux-persist); it holds mostly layout/theme state, not feature data. Feature data is fetched directly in components via the action functions.
- **Media**: images/files are stored on Cloudinary (`CloudinaryImage` type, `res.cloudinary.com` allowed in `next.config.js`); uploads go through `apiRequestFile` to backend upload endpoints.
