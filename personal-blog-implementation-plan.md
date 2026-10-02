# Personal Blog Platform — Implementation Plan

> **Last updated:** 2 October 2026
> **Status key:** Done · In Progress · Not Started

---

## 1. Project Objective

Build a personal blogging platform consisting of **two separate web
applications** connected to the same Firebase project.

### Site 1 — Public Blog

**Purpose:** Visitors read and explore published articles.

Visitors can read published articles, browse all articles, search, filter by category, read individual articles, view related articles, view author/about info, share articles, and navigate between articles.

Visitors must **not** be able to create, edit, delete, or publish articles.

### Site 2 — Private Admin CMS

**Purpose:** The blog owner writes and manages articles.

Admin can: log in securely, create/edit articles, save drafts, preview articles, upload images, manage categories and tags, publish/unpublish, delete/archive, manage SEO metadata, view dashboard stats, and manage site settings.

No public registration. One authorized admin account.

---

## 2. Technology Stack

### Public Site (IMPLEMENTED)
- React + TypeScript
- Vite
- Tailwind CSS v4 (via @import 'tailwindcss')
- React Router v6
- Firebase SDK (Firestore, Storage)
- react-helmet-async (SEO / meta tags)
- react-markdown + remark-gfm (Markdown rendering)
- rehype-highlight (syntax highlighting)
- Google Fonts: Space Grotesk, Inter, Source Serif 4

### Admin Site (IMPLEMENTED)
- React + TypeScript
- Vite
- Tailwind CSS v4
- React Router v6
- Firebase Authentication + Firestore + Storage
- react-markdown + remark-gfm (Markdown preview)
- Custom Markdown editor (textarea-based, split-pane)

### Backend / Infrastructure (IMPLEMENTED)
- Firebase Authentication (email + password)
- Cloud Firestore
- Firebase Storage
- Firebase Security Rules (Firestore + Storage)
- Firestore Composite Indexes (5 deployed)
- Firebase Hosting (two targets: public + admin)
- Vercel config (vercel.json) in both apps as alternative

No custom Express/Node.js backend. Firebase handles all backend concerns in V1.

---

## 3. Overall Architecture

```
                         Firebase Project
                              |
             +----------------+----------------+
             |                |                |
      Authentication      Firestore        Storage
             |                |                |
             +----------------+----------------+
                              |
             +----------------+----------------+
             |                                 |
      Public React App                   Admin React App
             |                                 |
      yourdomain.com                   admin.yourdomain.com
```

---

## 4. Repository Structure (Actual — as of Oct 2026)

```
personal-blog/
|
+-- public-site/
|   +-- src/
|   |   +-- assets/
|   |   +-- components/
|   |   |   +-- markdown/
|   |   |   |   +-- CodeBlock.tsx
|   |   |   |   +-- MarkdownRenderer.tsx
|   |   |   +-- ArticleCard.tsx
|   |   |   +-- ArticleHeader.tsx
|   |   |   +-- ArticleMeta.tsx
|   |   |   +-- ArticleNavigation.tsx
|   |   |   +-- CategoryBadge.tsx
|   |   |   +-- FeaturedArticle.tsx
|   |   |   +-- Footer.tsx
|   |   |   +-- Navbar.tsx
|   |   |   +-- ReadingProgress.tsx
|   |   |   +-- RelatedArticles.tsx
|   |   |   +-- SearchBar.tsx
|   |   |   +-- Seo.tsx
|   |   |   +-- States.tsx
|   |   |   +-- Tag.tsx
|   |   +-- data/
|   |   |   +-- sample.ts  (placeholder sample data)
|   |   +-- hooks/
|   |   |   +-- useContent.ts
|   |   +-- layouts/
|   |   |   +-- PublicLayout.tsx
|   |   +-- pages/
|   |   |   +-- AboutPage.tsx
|   |   |   +-- ArticlePage.tsx
|   |   |   +-- ArticlesPage.tsx
|   |   |   +-- CategoryPage.tsx
|   |   |   +-- HomePage.tsx
|   |   |   +-- NotFoundPage.tsx
|   |   |   +-- SearchPage.tsx
|   |   +-- services/firebase/
|   |   |   +-- config.ts
|   |   |   +-- content.ts      (Firestore read queries)
|   |   |   +-- mapArticle.ts
|   |   +-- types/index.ts
|   |   +-- utils/
|   |       +-- dates.ts
|   |       +-- readingTime.ts
|   |       +-- relatedArticles.ts
|   |       +-- slugify.ts
|   +-- dist/  (production build)
|   +-- .env / .env.example
|   +-- index.html / vite.config.ts / vercel.json
|
+-- admin-site/
|   +-- src/
|   |   +-- components/
|   |   |   +-- markdown/
|   |   |   |   +-- CodeBlock.tsx
|   |   |   |   +-- MarkdownRenderer.tsx
|   |   |   +-- AdminLayout.tsx
|   |   |   +-- AdminSidebar.tsx
|   |   |   +-- ConfirmDialog.tsx
|   |   |   +-- ImageUploader.tsx
|   |   |   +-- ProtectedRoute.tsx
|   |   |   +-- SaveIndicator.tsx
|   |   |   +-- StatCard.tsx
|   |   |   +-- StatusBadge.tsx
|   |   |   +-- Topbar.tsx
|   |   +-- hooks/
|   |   |   +-- useAuth.tsx    (AuthProvider + useAuth)
|   |   |   +-- useToast.tsx   (ToastProvider + useToast)
|   |   +-- pages/
|   |   |   +-- ArticleEditorPage.tsx  (full editor, ~32 KB)
|   |   |   +-- ArticlesPage.tsx       (article list/mgmt, ~16 KB)
|   |   |   +-- CategoriesPage.tsx     (category CRUD, ~11 KB)
|   |   |   +-- DashboardPage.tsx      (stats + recent, ~9 KB)
|   |   |   +-- LoginPage.tsx
|   |   |   +-- SettingsPage.tsx       (site settings, ~11 KB)
|   |   +-- services/firebase/
|   |   |   +-- auth.ts
|   |   |   +-- cms.ts         (Firestore write + admin queries)
|   |   |   +-- config.ts
|   |   |   +-- mapArticle.ts
|   |   |   +-- storage.ts
|   |   +-- types/index.ts
|   |   +-- utils/
|   |       +-- dates.ts
|   |       +-- readingTime.ts
|   |       +-- slugify.ts
|   +-- dist/  (production build)
|   +-- .env / .env.example
|   +-- index.html / vite.config.ts / vercel.json
|
+-- firebase/
|   +-- .firebaserc
|   +-- firebase.json               (hosting targets: public + admin)
|   +-- firestore.indexes.json      (5 composite indexes)
|   +-- firestore.rules             (security rules)
|   +-- storage.rules
|
+-- personal-blog-implementation-plan.md
+-- .gitignore
```

---

## 5. Firebase Setup — DONE

- Firebase project created
- Authentication enabled (email + password)
- Cloud Firestore enabled
- Firebase Storage enabled
- Firebase Hosting configured (two targets: public and admin)
- Admin account created
- Environment variables in .env for both apps (not committed to git)

---

## 6. Firebase Authentication — DONE

- Email + Password authentication
- No public registration
- Admin login page implemented
- Logout implemented
- Persistent auth session via Firebase SDK
- AuthProvider context with useAuth hook (admin-site/src/hooks/useAuth.tsx)
- ProtectedRoute component guards all admin routes
- Unauthorized users redirected to /login
- Admin role verified via users/{userId} document AND email allowlist
- Authorization enforced in Firestore Security Rules (not just UI)

---

## 7. Firestore Database Design — DONE

### Collections

**users/{userId}**
```json
{
  "name": "Dhanush",
  "email": "admin@example.com",
  "role": "admin",
  "photoURL": "",
  "createdAt": "timestamp"
}
```

**articles/{articleId}**
```json
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "# Markdown content",
  "coverImage": "https://...",
  "status": "published",
  "category": "Artificial Intelligence",
  "categorySlug": "artificial-intelligence",
  "tags": ["AI", "Python"],
  "authorId": "firebase-user-id",
  "authorName": "Dhanush",
  "readingTime": 8,
  "seoTitle": "...",
  "seoDescription": "...",
  "canonicalUrl": "",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "publishedAt": "timestamp"
}
```

Statuses: draft | published | archived

**categories/{categoryId}**
```json
{
  "name": "Artificial Intelligence",
  "slug": "artificial-intelligence",
  "description": "Articles about AI and machine learning"
}
```

**Tags:** stored inline as string[] on each article. No separate tags collection yet.

**settings/site**
```json
{
  "siteName": "Dhanush",
  "siteDescription": "...",
  "authorName": "Dhanush",
  "authorBio": "...",
  "profileImage": "...",
  "socialLinks": { "github": "", "linkedin": "", "medium": "" }
}
```

---

## 8. Firebase Security Rules — DONE

### Firestore (firebase/firestore.rules)

| Actor | Permission |
|---|---|
| Public (unauthenticated) | Read published articles only; read all categories; read settings/site |
| Public | Cannot read draft or archived articles |
| Admin | Full read/write on articles, categories, settings |
| Admin verified by | users/{uid}.role == 'admin' OR email allowlist (bootstrap) |

Key functions: isPublishedArticle(), isAdmin(), isAdminEmail()

### Storage (firebase/storage.rules)
- Admin-only uploads
- File type and size validation

---

## 9. Firebase Storage — DONE

Storage paths:
```
/article-covers/{articleId}/
/article-images/{articleId}/
/profile/
```

- ImageUploader component in admin site
- Upload progress shown
- Image preview after upload
- Download URL inserted into article metadata
- Service: admin-site/src/services/firebase/storage.ts

---

## 10. Firestore Indexes — DONE

5 composite indexes in firebase/firestore.indexes.json:

| Fields | Purpose |
|---|---|
| status ASC + publishedAt DESC | Homepage / articles listing |
| status ASC + category ASC + publishedAt DESC | Category filter |
| status ASC + categorySlug ASC + publishedAt DESC | Category by slug |
| status ASC + slug ASC | Article lookup by slug |
| status ASC + updatedAt DESC | Admin article list |

---

## 11. Public Site Routes — DONE

All routes in public-site/src/App.tsx. All wrapped in PublicLayout (Navbar + Footer).

| Route | Component |
|---|---|
| / | HomePage |
| /articles | ArticlesPage |
| /articles/:slug | ArticlePage |
| /category/:slug | CategoryPage |
| /search | SearchPage |
| /about | AboutPage |
| /404 | NotFoundPage |
| * | Redirects to /404 |

---

## 12. Admin Site Routes — DONE

All routes in admin-site/src/App.tsx. All except /login wrapped in ProtectedRoute -> AdminLayout.

| Route | Component |
|---|---|
| /login | LoginPage |
| /dashboard | DashboardPage |
| /articles | ArticlesPage |
| /articles/new | ArticleEditorPage |
| /articles/:id/edit | ArticleEditorPage |
| /categories | CategoriesPage |
| /settings | SettingsPage |
| / | Redirects to /dashboard |

---

## 13. Public Site Design — DONE

### Color System (current — light theme)

NOTE: The original plan called for a dark (#0D0D0D) public background.
The current implementation uses a light (#FFFFFF) background. This can be revisited before launch.

```css
--brand-red: #e00000;
--brand-dark-red: #470000;
--brand-gradient: linear-gradient(220.55deg, #e00000 0%, #470000 100%);

--public-bg: #ffffff;
--public-surface: #f7f7f7;
--public-surface-hover: #efefef;
--public-text: #111111;
--public-text-secondary: #555555;
--public-border: #e2e2e2;
```

### Admin Color System (as planned)

```css
--admin-bg: #F5F5F5;
--admin-surface: #FFFFFF;
--admin-text: #171717;
--admin-text-secondary: #6B6B6B;
--admin-border: #E5E5E5;
```

### Typography (DONE)

| Use | Font |
|---|---|
| Headings | Space Grotesk |
| UI / body | Inter |
| Article body | Source Serif 4 |

All three loaded from Google Fonts. Registered in Tailwind v4 @theme block.

### Design System Tokens (DONE)
- Brand gradient CSS custom properties in both index.css files
- Tailwind v4 @theme block with font and color tokens
- .bg-brand-gradient and .text-brand-gradient utility classes
- .page-shell responsive container (max 1120px centered)
- .article-prose typography system with full article styling
- Reduced-motion media query
- --radius, --shadow, --transition tokens

### Deviations from original spec

| Spec | Current |
|---|---|
| Dark public site (#0D0D0D bg) | Light public site (#FFFFFF bg) |
| --brand-red: #FF0000 | --brand-red: #e00000 (slightly desaturated) |

---

## 14. Public Components — ALL DONE

| Component | File |
|---|---|
| Navbar | Navbar.tsx |
| Footer | Footer.tsx |
| ArticleCard | ArticleCard.tsx |
| FeaturedArticle | FeaturedArticle.tsx |
| CategoryBadge | CategoryBadge.tsx |
| Tag | Tag.tsx |
| SearchBar | SearchBar.tsx |
| ArticleMeta | ArticleMeta.tsx |
| ArticleHeader | ArticleHeader.tsx |
| MarkdownRenderer | markdown/MarkdownRenderer.tsx |
| CodeBlock | markdown/CodeBlock.tsx |
| RelatedArticles | RelatedArticles.tsx |
| ArticleNavigation | ArticleNavigation.tsx |
| ReadingProgress | ReadingProgress.tsx |
| Seo | Seo.tsx |
| States | States.tsx (loading/error/empty states) |

---

## 15. Admin Components — DONE

| Component | File |
|---|---|
| AdminLayout | AdminLayout.tsx |
| AdminSidebar | AdminSidebar.tsx |
| Topbar | Topbar.tsx |
| StatCard | StatCard.tsx |
| StatusBadge | StatusBadge.tsx |
| ImageUploader | ImageUploader.tsx |
| SaveIndicator | SaveIndicator.tsx |
| ConfirmDialog | ConfirmDialog.tsx |
| ProtectedRoute | ProtectedRoute.tsx |
| MarkdownRenderer | markdown/MarkdownRenderer.tsx |
| CodeBlock | markdown/CodeBlock.tsx |
| Toast/ToastProvider | via useToast hook |

Not yet extracted as standalone components (but implemented inline):
- ArticleTable (inline in ArticlesPage)
- MetadataPanel (inline in ArticleEditorPage)
- MarkdownEditor (inline in ArticleEditorPage)
- MarkdownPreview (inline in ArticleEditorPage)

---

## 16. Article Editor — DONE

Implemented in admin-site/src/pages/ArticleEditorPage.tsx (~32 KB).

### Editor Features

| Feature | Status |
|---|---|
| Title field | DONE |
| Auto-generated slug from title | DONE |
| Manual slug editing | DONE |
| Markdown editor (textarea) | DONE |
| Live split-pane Markdown preview | DONE |
| Cover image upload | DONE |
| Excerpt field | DONE |
| Category selector | DONE |
| Tags input | DONE |
| Status selector (draft/published/archived) | DONE |
| SEO title | DONE |
| SEO description | DONE |
| Canonical URL | DONE |
| Reading time (auto-calculated) | DONE |
| Save draft | DONE |
| Publish | DONE |
| Unpublish / archive | DONE |
| Delete article | DONE |
| Auto-save with debouncing | DONE |
| Save status indicator | DONE |
| Unsaved-changes warning | DONE |
| Image insertion into content | NOT STARTED |
| Keyboard shortcuts | NOT STARTED |

---

## 17. Admin Pages — ALL DONE

| Page | Key Features |
|---|---|
| LoginPage | Brand gradient bg, email+password form, Firebase Auth |
| DashboardPage | Published/Draft/Total counts, recent articles table, quick actions |
| ArticlesPage | Full article list, status filter, search, delete, publish/archive |
| ArticleEditorPage | Full editor (see section 16) |
| CategoriesPage | Create/edit/delete categories with slug management |
| SettingsPage | Site name, description, author bio, profile image, social links |

---

## 18. Public Pages — ALL DONE

| Page | Key Features |
|---|---|
| HomePage | Hero, featured article, latest articles, category pills, about snippet |
| ArticlesPage | Editorial grid, category filter, search, pagination/loading |
| ArticlePage | Full article render, reading progress, tags, prev/next, related |
| CategoryPage | Filtered articles by category slug |
| SearchPage | Client-side search over article metadata |
| AboutPage | Personal introduction, interests, social links |
| NotFoundPage | 404 page with navigation link |

---

## 19. Firebase Services — DONE

### Public site (public-site/src/services/firebase/)

| File | Purpose |
|---|---|
| config.ts | Firebase app init, Firestore + Storage exports |
| content.ts | Read-only Firestore queries (articles, categories, settings, search) |
| mapArticle.ts | Firestore document to typed Article object |

### Admin site (admin-site/src/services/firebase/)

| File | Purpose |
|---|---|
| config.ts | Firebase app init, Firestore + Storage + Auth exports |
| auth.ts | Sign in, sign out, auth state listener |
| cms.ts | Full Firestore CRUD (articles, categories, settings) |
| mapArticle.ts | Firestore document to typed Article object |
| storage.ts | Image upload to Firebase Storage, get download URL |

---

## 20. Utilities — DONE

| Utility | Public | Admin |
|---|---|---|
| dates.ts | YES | YES |
| readingTime.ts | YES | YES |
| slugify.ts | YES | YES |
| relatedArticles.ts | YES | — |

---

## 21. Hooks — DONE

| Hook | Location | Purpose |
|---|---|---|
| useContent | public-site | Fetches articles/categories from Firestore |
| useAuth / AuthProvider | admin-site | Firebase auth state, login, logout |
| useToast / ToastProvider | admin-site | In-app notification toasts |

---

## 22. SEO — MOSTLY DONE

- Seo.tsx component using react-helmet-async
- Dynamic title and meta description per page
- Open Graph tags (og:title, og:description, og:image)
- Article structured data (application/ld+json)
- Canonical URL support
- Clean slug-based URLs (/articles/my-article-slug)
- Sitemap (/sitemap.xml) — NOT YET CREATED
- robots.txt — NOT YET CREATED

---

## 23. Markdown Rendering — DONE

Both sites use the same stack:
- react-markdown with remark-gfm
- rehype-highlight for syntax highlighting
- Custom CodeBlock component with copy button and language label
- Custom MarkdownRenderer component handling all node types
- Article heading h2 uses red left-border accent (border-left: 3px solid #e00000)

Supported: H1-H6, paragraphs, bold, italic, links, ordered/unordered lists,
images, blockquotes, fenced code blocks, inline code, tables, horizontal rules.

---

## 24. Draft Workflow — DONE

Create Article -> Draft (auto-saved) -> Preview (in editor) -> Publish -> Published
-> Edit / Unpublish -> Draft or Archived

Drafts are enforced private by Firestore Security Rules (not just UI filtering).

---

## 25. Auto-save — DONE

- Debounced auto-save (fires ~1-2s after user stops typing)
- SaveIndicator component shows: Saving... / Saved just now / Saved X seconds ago
- Implemented in ArticleEditorPage

---

## 26. Deployment Configuration — DONE (config only; live deploy pending)

### Firebase Hosting (firebase/firebase.json)
- Target "public" -> ../public-site/dist
- Target "admin" -> ../admin-site/dist
- Both with SPA rewrites (** -> /index.html)
- Cache-control headers for static assets
- admin target has robots.txt cache header configured

### Vercel (vercel.json in each app)
- Alternative deployment; each app deployed as a separate Vercel project
- Both apps have production builds in /dist

---

## 27. Implementation Phases — Progress

| Phase | Description | Status |
|---|---|---|
| 1 | Architecture and Specification | DONE |
| 2 | Firebase Foundation | DONE |
| 3 | Project Initialization | DONE |
| 4 | Design System | DONE |
| 5 | Authentication | DONE |
| 6 | Admin CMS CRUD | DONE |
| 7 | Article Editor | DONE |
| 8 | Admin Dashboard | DONE |
| 9 | Public Blog | DONE |
| 10 | Article Experience | DONE |
| 11 | SEO | IN PROGRESS (sitemap + robots.txt missing) |
| 12 | Security Audit | NOT STARTED |
| 13 | Performance Audit | NOT STARTED |
| 14 | Responsive and Accessibility Audit | NOT STARTED |
| 15 | Deployment | IN PROGRESS (config done; live domain pending) |

---

## 28. Definition of Done — Current State

### Firebase
- [x] Authentication works
- [x] Firestore works
- [x] Storage works
- [x] Security rules deployed and tested
- [x] Required indexes configured

### Admin
- [x] Login works
- [x] Protected routes work
- [x] Dashboard works
- [x] Create article works
- [x] Edit article works
- [x] Drafts work
- [x] Preview works (split-pane in editor)
- [x] Image uploads work
- [x] Publish works
- [x] Unpublish works
- [x] Delete/archive works
- [x] Categories work
- [x] Tags work
- [x] SEO metadata works
- [x] Site settings work

### Public
- [x] Homepage works
- [x] Articles page works
- [x] Article page works
- [x] Category pages work
- [x] Search works
- [x] About page works
- [x] 404 page works
- [x] Only published content is visible

### Design
- [x] Brand gradient implemented
- [ ] Dark editorial public theme (light theme used instead — decision pending)
- [x] Light admin workspace
- [x] Typography system implemented (Space Grotesk / Inter / Source Serif 4)
- [x] Accessible focus states (red outline)
- [x] Reduced-motion support

### SEO
- [x] Dynamic titles
- [x] Meta descriptions
- [x] Canonical URLs
- [x] Open Graph metadata
- [x] Article structured data
- [ ] Sitemap (/sitemap.xml)
- [ ] robots.txt

### Quality
- [ ] Mobile tested (end-to-end)
- [ ] Desktop tested (end-to-end)
- [ ] Security audit
- [ ] Performance reviewed
- [ ] Accessibility reviewed
- [x] Error states handled (States.tsx)
- [x] Loading states handled
- [x] Empty states handled
- [ ] Production deployment verified (live domain)

---

## 29. Remaining Work

### High priority
1. Sitemap — Generate /sitemap.xml listing all published article URLs
2. robots.txt — Allow public site crawling; block admin site indexing
3. Security audit — Manually test Firestore rules against anonymous/non-admin clients
4. Production deployment — Deploy both sites and verify on live domains

### Medium priority
5. Dark theme decision — Revisit whether to switch public site to dark (#0D0D0D) as per original spec
6. Image insertion in editor — Allow inserting uploaded images directly into Markdown content
7. Keyboard shortcuts in editor (Ctrl+B bold, Ctrl+S save, etc.)
8. Mobile audit — Test all pages on real mobile devices

### Low priority / future features
9. Comments
10. Newsletter / RSS feed
11. View counters / Firebase Analytics
12. Search engine integration (Algolia/Typesense) if content grows large
13. Draft scheduling
14. AI-assisted writing / summaries

---

## 30. Master Development Rules

1. Do not build the entire system blindly in one pass.
2. Work phase-by-phase.
3. Preserve existing working functionality.
4. Do not replace working architecture without a reason.
5. Use TypeScript throughout.
6. Keep components reusable.
7. Keep Firebase logic separated from UI components.
8. Use environment variables for configuration.
9. Never place Firebase Admin credentials in frontend code.
10. Enforce authorization through Firebase Security Rules.
11. Never expose drafts publicly.
12. Do not introduce a custom backend unless necessary.
13. Keep the public and admin applications visually distinct.
14. Use the exact brand gradient: linear-gradient(220.55deg, #e00000 0%, #470000 100%)
15. Do not overuse the gradient.
16. Prioritize readability over visual effects.
17. Make the public site mobile-first.
18. Make the admin editor comfortable for long writing sessions.
19. Provide loading, error, and empty states.
20. Test after every major module.
21. Avoid unnecessary dependencies.
22. Keep Firestore queries efficient.
23. Do not fetch full article content when displaying article lists.
24. Optimize uploaded images.
25. Keep SEO in mind from the beginning.
26. Use semantic HTML.
27. Maintain accessible keyboard navigation.
28. Do not sacrifice security for convenience.
29. Document important setup decisions.
30. Keep the codebase clean enough for future expansion.

---

## 31. Final Product Vision

The finished platform should feel like a personal technical publication
with a professional private publishing system behind it.

The public experience: Editorial, Technical, Bold, Minimal, Premium.
The admin experience: Clean, Focused, Fast, Organized, Comfortable for writing.

Brand gradient: linear-gradient(220.55deg, #e00000 0%, #470000 100%)

Technical foundation:
  React + TypeScript + Vite + Firebase Auth + Firestore + Firebase Storage

No custom backend complexity in V1. Architecture extensible for future expansion.
