# Personal Blog Platform --- Implementation Plan

## 1. Project Objective

Build a personal blogging platform consisting of **two separate web
applications** connected to the same Firebase project.

### Site 1 --- Public Blog

**Purpose:** Visitors read and explore published articles.

Example:

``` text
https://yourdomain.com
```

Visitors can:

-   Read published articles
-   Browse all articles
-   Search articles
-   Filter by category
-   Explore tags
-   Read individual articles
-   View related articles
-   View author/about information
-   Share articles
-   Navigate between previous/next articles

Visitors must **not** be able to create, edit, delete, or publish
articles.

### Site 2 --- Private Admin CMS

**Purpose:** The blog owner writes and manages articles.

Example:

``` text
https://admin.yourdomain.com
```

Admin can:

-   Log in securely
-   Create articles
-   Edit articles
-   Save drafts
-   Preview articles
-   Upload images
-   Add categories and tags
-   Publish/unpublish articles
-   Delete or archive articles
-   Manage SEO metadata
-   View dashboard statistics
-   Manage basic site settings

There should be **no public registration**. The initial version should
support one authorized admin account.

------------------------------------------------------------------------

# 2. Recommended Technology Stack

## Public Site

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   Firebase SDK
-   Firestore
-   Firebase Storage
-   Markdown renderer
-   Syntax highlighting

## Admin Site

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   Firebase Authentication
-   Firestore
-   Firebase Storage
-   Markdown editor
-   Markdown preview

## Backend / Infrastructure

Use Firebase as the backend for V1.

-   Firebase Authentication
-   Cloud Firestore
-   Firebase Storage
-   Firebase Security Rules
-   Firebase Hosting or Vercel for deployment

### V1 backend decision

Do **not** create a custom Express/Node.js backend unless a future
feature requires server-side processing.

This keeps the first version simpler, cheaper, and easier to maintain.

------------------------------------------------------------------------

# 3. Overall Architecture

``` text
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
             |                                 |
       Read published                  Authenticate admin
          articles                    Manage all articles
```

------------------------------------------------------------------------

# 4. Repository Structure

Use a monorepo-style structure:

``` text
personal-blog/
│
├── public-site/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── firebase/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── admin-site/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── firebase/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── firebase/
│   ├── firestore.rules
│   ├── storage.rules
│   ├── firestore.indexes.json
│   └── firebase.json
│
├── README.md
└── .gitignore
```

Keep the public and admin applications logically independent while
sharing Firebase configuration and common data-model conventions.

------------------------------------------------------------------------

# 5. Firebase Setup

Create one Firebase project for the complete platform.

Enable:

-   Authentication
-   Cloud Firestore
-   Storage
-   Hosting if Firebase Hosting is selected

Optional later:

-   Firebase Analytics
-   Firebase App Check
-   Cloud Functions

------------------------------------------------------------------------

# 6. Firebase Authentication

Use:

**Email + Password Authentication**

Initial requirements:

-   No public registration
-   One admin account
-   Login page for admin
-   Logout functionality
-   Persistent authentication session
-   Protected admin routes
-   Unauthorized users redirected to login

Admin access should not depend only on hiding UI controls.

Authorization must also be enforced by Firebase Security Rules.

Recommended user document:

``` text
users/{userId}
```

Example:

``` json
{
  "name": "Dhanush",
  "email": "admin@example.com",
  "role": "admin",
  "photoURL": "",
  "createdAt": "timestamp"
}
```

------------------------------------------------------------------------

# 7. Firestore Database Design

## 7.1 Users

Collection:

``` text
users/{userId}
```

Fields:

``` json
{
  "name": "Dhanush",
  "email": "admin@example.com",
  "role": "admin",
  "photoURL": "",
  "createdAt": "timestamp"
}
```

------------------------------------------------------------------------

## 7.2 Articles

Collection:

``` text
articles/{articleId}
```

Example:

``` json
{
  "title": "How I Built Crowd Guard",
  "slug": "how-i-built-crowd-guard",
  "excerpt": "My journey building a real-time crowd monitoring platform.",
  "content": "# Introduction\n\nArticle content...",
  "coverImage": "https://...",
  "status": "published",
  "category": "Artificial Intelligence",
  "tags": [
    "AI",
    "Computer Vision",
    "Projects"
  ],
  "authorId": "firebase-user-id",
  "authorName": "Dhanush",
  "readingTime": 8,
  "seoTitle": "How I Built Crowd Guard",
  "seoDescription": "A technical breakdown of...",
  "canonicalUrl": "",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "publishedAt": "timestamp"
}
```

Supported statuses:

``` text
draft
published
archived
```

------------------------------------------------------------------------

## 7.3 Categories

Collection:

``` text
categories/{categoryId}
```

Example:

``` json
{
  "name": "Artificial Intelligence",
  "slug": "artificial-intelligence",
  "description": "Articles about AI and machine learning"
}
```

Potential categories:

-   Artificial Intelligence
-   Data Analytics
-   Programming
-   Web Development
-   Projects
-   Career
-   Learning
-   Technology
-   Ideas

Categories should remain manageable through the admin CMS.

------------------------------------------------------------------------

## 7.4 Tags

Tags can initially be stored directly inside articles.

Example:

``` json
[
  "Python",
  "Firebase",
  "React",
  "Computer Vision"
]
```

A dedicated `tags` collection can be introduced later if tag management
becomes more complex.

------------------------------------------------------------------------

## 7.5 Settings

Use a settings document for global configuration.

Example:

``` text
settings/site
```

Possible fields:

``` json
{
  "siteName": "Dhanush",
  "siteDescription": "Personal blog about technology and learning.",
  "authorName": "Dhanush",
  "authorBio": "",
  "profileImage": "",
  "socialLinks": {
    "github": "",
    "linkedin": "",
    "medium": ""
  }
}
```

------------------------------------------------------------------------

# 8. Firebase Security Rules

Security rules are a critical part of the implementation.

## Public users

Can:

-   Read published articles
-   Read public categories
-   Read public settings

Cannot:

-   Create articles
-   Edit articles
-   Delete articles
-   Read drafts
-   Read archived articles
-   Modify categories
-   Upload files

## Admin

Can:

-   Read all articles
-   Create articles
-   Edit articles
-   Delete/archive articles
-   Manage categories
-   Read/write admin settings
-   Upload/update/delete storage files

Important:

**Draft articles must never be readable through the public
application.**

The security rules must enforce this independently of frontend
filtering.

------------------------------------------------------------------------

# 9. Firebase Storage

Use Firebase Storage for:

``` text
/storage
├── profile/
├── article-covers/
└── article-images/
```

Example:

``` text
article-covers/article-id/image.jpg
article-images/article-id/image-01.png
profile/profile.jpg
```

Requirements:

-   Validate file type
-   Validate file size
-   Prevent unauthorized uploads
-   Allow only authenticated admin uploads
-   Delete unused images when appropriate
-   Generate stable download URLs

Supported initial image formats:

-   JPG/JPEG
-   PNG
-   WebP

Prefer WebP for optimized article images where possible.

------------------------------------------------------------------------

# 10. Public Site Routes

Implement:

``` text
/
```

Home page.

``` text
/articles
```

All published articles.

``` text
/articles/:slug
```

Individual article.

``` text
/category/:slug
```

Category-specific articles.

``` text
/search
```

Search results.

``` text
/about
```

Personal/about page.

``` text
/404
```

Not-found page.

------------------------------------------------------------------------

# 11. Admin Site Routes

Implement:

``` text
/login
```

Admin login.

``` text
/dashboard
```

Dashboard overview.

``` text
/articles
```

Article management.

``` text
/articles/new
```

Create article.

``` text
/articles/:id/edit
```

Edit article.

``` text
/settings
```

Site/admin settings.

All routes except `/login` must be protected.

------------------------------------------------------------------------

# 12. Public Homepage

The homepage should feel like a premium personal digital publication
rather than a generic blog template.

Recommended structure:

``` text
Navbar
    ↓
Hero / Introduction
    ↓
Featured Article
    ↓
Latest Articles
    ↓
Topics / Categories
    ↓
Short About Section
    ↓
Footer
```

## Hero

Suggested content direction:

``` text
PERSONAL BLOG / NOTES

BUILD. LEARN. DOCUMENT.

Ideas, projects, experiments and things I'm learning along the way.

[ Explore Articles ]
```

Do not copy this wording blindly; allow the final copy to be adjusted
during implementation.

------------------------------------------------------------------------

# 13. Public Visual Design

The visual identity must use this exact gradient:

``` css
background: linear-gradient(220.55deg, #FF0000 0%, #470000 100%);
```

Do not alter:

-   Angle
-   Red
-   Dark red

Define it as:

``` css
--brand-red: #FF0000;
--brand-dark-red: #470000;
--brand-gradient: linear-gradient(
  220.55deg,
  #FF0000 0%,
  #470000 100%
);
```

------------------------------------------------------------------------

# 14. Public Color System

``` css
:root {
  --brand-red: #FF0000;
  --brand-dark-red: #470000;
  --brand-gradient: linear-gradient(
    220.55deg,
    #FF0000 0%,
    #470000 100%
  );

  --public-bg: #0D0D0D;
  --public-surface: #151515;
  --public-surface-hover: #1D1D1D;
  --public-text: #FFFFFF;
  --public-text-secondary: #A8A8A8;
  --public-border: #2A2A2A;

  --admin-bg: #F5F5F5;
  --admin-surface: #FFFFFF;
  --admin-text: #171717;
  --admin-text-secondary: #6B6B6B;
  --admin-border: #E5E5E5;

  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

------------------------------------------------------------------------

# 15. Gradient Usage Rules

The gradient is the core brand element, but it should be used
selectively.

Use it for:

-   Hero sections
-   Admin login experience
-   Primary CTA buttons
-   Selected navigation states
-   Logo/brand elements
-   Featured content
-   Publish button
-   Important visual accents
-   Small decorative elements

Do **not** use the gradient on:

-   Every card
-   Every button
-   Article backgrounds
-   Every heading
-   Every tag
-   The entire admin dashboard
-   Every navigation item

The design should remain sophisticated and restrained.

------------------------------------------------------------------------

# 16. Public Site Design Language

The public site should feel:

-   Bold
-   Dark
-   Technical
-   Premium
-   Editorial
-   Minimal
-   Modern
-   High contrast
-   Red-focused

Use predominantly black/dark surfaces with white typography.

The exact red gradient should act as a strong brand accent rather than
overwhelming the page.

------------------------------------------------------------------------

# 17. Public Navbar

Design:

-   Dark/black background
-   Minimal navigation
-   Logo/name
-   Articles
-   Categories/topics
-   About
-   Search icon/button

The logo can use the brand gradient as text or a small accent.

Mobile:

``` text
Logo        Menu
```

Use a hamburger menu.

------------------------------------------------------------------------

# 18. Article Cards

Article cards should use:

-   Dark surface
-   Subtle border
-   Cover image
-   Category
-   Title
-   Excerpt
-   Date
-   Reading time

Hover behavior:

-   Slight image zoom
-   Subtle border change toward red
-   Title may transition toward red
-   Small elevation/transform

Avoid excessive animation.

------------------------------------------------------------------------

# 19. Articles Page

Do not create a wall of identical cards.

Use an editorial list/grid hybrid.

Example:

``` text
Articles

[Featured / Large Article]

Latest
------------------------------------------------
Article
Article
Article
------------------------------------------------

Filter by:
AI | Data | Programming | Projects
```

Include:

-   Search
-   Category filtering
-   Tag filtering if useful
-   Pagination or progressive loading

------------------------------------------------------------------------

# 20. Individual Article Page

Article layout:

``` text
Category

Large Article Title

Excerpt

Date • Reading Time

Cover Image

--------------------------------
Article Content
--------------------------------

Tags

Previous / Next

Related Articles
```

Content width:

``` text
700–760px
```

The article should prioritize reading comfort.

Use:

-   Large readable headings
-   Generous line spacing
-   Strong paragraph spacing
-   Code blocks
-   Images
-   Captions where appropriate
-   Blockquotes
-   Lists
-   Tables

------------------------------------------------------------------------

# 21. Article Heading Design

Article headings may use a small red visual indicator.

Example:

``` text
|  Why I Built This Project
```

Implementation direction:

``` css
border-left: 3px solid #FF0000;
padding-left: 16px;
```

Use this sparingly.

------------------------------------------------------------------------

# 22. Code Blocks

Code blocks should use:

-   Near-black background
-   Monospace font
-   Syntax highlighting
-   Language label
-   Copy button
-   Red as a small accent

Example:

``` text
┌─────────────────────────────────┐
│ JavaScript              Copy    │
│                                 │
│ const article = await ...       │
│                                 │
└─────────────────────────────────┘
```

------------------------------------------------------------------------

# 23. Tags

Tags should be subtle.

Example:

``` text
[ AI ] [ Python ] [ Computer Vision ]
```

Use:

-   Dark surface
-   Thin border
-   Muted text
-   Red text/border on hover

Do not use the red gradient for every tag.

------------------------------------------------------------------------

# 24. About Page

The About page should feel personal rather than like a resume.

Possible direction:

> Hi, I'm Dhanush. I'm a student and technology enthusiast interested in
> AI, data, software and building useful products. I use this blog to
> document things I'm learning, projects I'm building, technical
> experiments, lessons from failures, and ideas I'm exploring.

Include:

-   Profile image
-   Short introduction
-   Areas of interest
-   Links to professional profiles
-   Optional featured projects

------------------------------------------------------------------------

# 25. Public Footer

Keep the footer minimal.

Include:

-   Name/logo
-   Short description
-   Social links
-   Copyright
-   Optional RSS link later

Avoid a large multi-column corporate footer.

------------------------------------------------------------------------

# 26. Typography

Recommended public typography:

### Headings

Use:

-   Space Grotesk
-   or Manrope

### UI

Use:

-   Inter

### Article body

Use:

-   Source Serif 4
-   or another highly readable editorial serif

Suggested sizes:

``` text
Desktop H1: 48–64px
Mobile H1: 36–42px

H2: 32–40px
H3: 24–28px

Article body desktop: 18–20px
Article body mobile: 17–18px

Line height: approximately 1.7

Metadata: 13–15px
```

------------------------------------------------------------------------

# 27. Admin UI Design

The admin application should intentionally feel different from the
public website.

It should function as a comfortable writing/productivity workspace.

Use:

``` text
Background: #F5F5F5
Surface: #FFFFFF
Text: #171717
Secondary: #6B6B6B
Border: #E5E5E5
```

Use the red gradient only for important brand/action elements.

------------------------------------------------------------------------

# 28. Admin Login

The login page can strongly use the exact brand gradient.

Suggested structure:

``` text
Full gradient background

       ┌─────────────────────┐
       │       LOGO          │
       │                     │
       │  Welcome back       │
       │                     │
       │  Email              │
       │  Password           │
       │                     │
       │  [ Sign In ]        │
       │                     │
       └─────────────────────┘
```

Use a clean white/light login card over the gradient.

------------------------------------------------------------------------

# 29. Admin Dashboard

Dashboard should show:

``` text
Published       Drafts       Total Articles
------------------------------------------------

Recent Articles
------------------------------------------------
Title       Status       Updated       Actions
------------------------------------------------

Quick Actions
[ New Article ]
```

Possible statistics:

-   Published articles
-   Draft articles
-   Total articles
-   Recently updated
-   Recently published

Do not add unnecessary analytics until the CMS workflow is stable.

------------------------------------------------------------------------

# 30. Admin Sidebar

Navigation:

``` text
Dashboard

Articles
  All Articles
  New Article

Categories

Settings

Logout
```

Selected navigation should use a subtle brand-red treatment.

------------------------------------------------------------------------

# 31. Admin Article Editor

The editor is one of the most important parts of the system.

Desktop:

``` text
┌────────────────────────────────────────────────────┐
│ Title                                              │
├───────────────────────────┬────────────────────────┤
│                           │ Metadata               │
│ Markdown Editor           │ Status                 │
│                           │ Category               │
│                           │ Tags                   │
│                           │ Cover Image             │
│                           │ Excerpt                 │
│                           │ SEO                     │
│                           │                        │
├───────────────────────────┴────────────────────────┤
│ Save Draft                  Preview    Publish      │
└────────────────────────────────────────────────────┘
```

Use a split editor/preview experience on desktop.

Mobile:

``` text
[ Editor ] [ Preview ]
```

------------------------------------------------------------------------

# 32. Article Editor Features

Required:

-   Title
-   Auto-generated slug
-   Markdown editor
-   Markdown preview
-   Cover image upload
-   Excerpt
-   Category
-   Tags
-   Status
-   SEO title
-   SEO description
-   Canonical URL
-   Publish date
-   Reading time
-   Save draft
-   Publish
-   Unpublish/archive
-   Delete
-   Preview

Recommended:

-   Auto-save
-   Save status
-   Unsaved-changes warning
-   Keyboard shortcuts
-   Image insertion
-   Link insertion
-   Code blocks
-   Tables
-   Blockquotes

------------------------------------------------------------------------

# 33. Markdown Content

Use Markdown as the article source format rather than arbitrary HTML.

Supported content should include:

-   H1--H6
-   Paragraphs
-   Bold
-   Italic
-   Links
-   Ordered lists
-   Unordered lists
-   Images
-   Blockquotes
-   Code blocks
-   Inline code
-   Tables
-   Horizontal rules

Use a Markdown editor such as Milkdown, MDXEditor, or another maintained
React-compatible editor.

The final implementation should avoid unnecessarily complex editor
dependencies.

------------------------------------------------------------------------

# 34. Draft Workflow

Article lifecycle:

``` text
Create
  ↓
Draft
  ↓
Preview
  ↓
Edit
  ↓
Publish
  ↓
Published
  ↓
Edit / Unpublish
  ↓
Draft or Archived
```

Drafts must remain private.

------------------------------------------------------------------------

# 35. Auto-save

Implement automatic draft saving.

Example status:

``` text
Saving...
Saved just now
Saved 20 seconds ago
```

Avoid writing to Firestore on every keystroke.

Use debouncing.

Example strategy:

``` text
User types
    ↓
Wait 1–2 seconds
    ↓
Save changes
```

------------------------------------------------------------------------

# 36. Unsaved Changes Protection

If the user has unsaved changes and attempts to leave:

``` text
You have unsaved changes.

Leave without saving?

[ Stay ] [ Leave ]
```

This should apply to the editor.

------------------------------------------------------------------------

# 37. Slug Generation

Automatically generate a slug from the title.

Example:

``` text
How I Built My First AI Project
```

becomes:

``` text
how-i-built-my-first-ai-project
```

Allow the admin to manually edit the slug.

Before publishing, verify slug uniqueness.

------------------------------------------------------------------------

# 38. Reading Time

Calculate approximate reading time from article content.

Example:

``` text
8 min read
```

The calculation can initially use an approximate words-per-minute value.

------------------------------------------------------------------------

# 39. Image Upload Workflow

Admin:

``` text
Select image
    ↓
Validate file
    ↓
Upload to Firebase Storage
    ↓
Receive download URL
    ↓
Insert URL into article
    ↓
Save article
```

Show upload progress.

Provide image preview.

------------------------------------------------------------------------

# 40. Preview System

The admin preview should use the **same visual article component** used
by the public site whenever practical.

This avoids differences between:

``` text
Admin Preview
```

and:

``` text
Published Article
```

For unpublished drafts, preview should remain accessible only to the
authenticated admin.

------------------------------------------------------------------------

# 41. Search

V1 search can use client-side filtering over fetched published article
metadata if the dataset is small.

For a larger blog, consider:

-   Algolia
-   Typesense
-   Meilisearch
-   Firebase-compatible search architecture

Do not introduce a search service unnecessarily during V1.

------------------------------------------------------------------------

# 42. Related Articles

Related articles can initially be determined using:

-   Same category
-   Shared tags
-   Recent publication date

A simple scoring approach is sufficient.

Example:

``` text
Same category       +3
Shared tag          +1 each
Recent article      +1
```

Keep this logic client-side or in a utility initially.

------------------------------------------------------------------------

# 43. SEO

Every published article should support:

-   SEO title
-   Meta description
-   Canonical URL
-   Open Graph title
-   Open Graph description
-   Open Graph image
-   Article structured data
-   Semantic HTML
-   Clean URLs

Example:

``` text
/articles/how-i-built-crowd-guard
```

Avoid:

``` text
/article?id=123
```

------------------------------------------------------------------------

# 44. Structured Data

Add `Article` structured data where appropriate.

Include:

-   Headline
-   Description
-   Image
-   Author
-   Date published
-   Date modified
-   Main entity URL

Validate the generated structured data before production.

------------------------------------------------------------------------

# 45. Sitemap

Generate:

``` text
/sitemap.xml
```

It should contain published article URLs and important public pages.

Draft and archived articles must not appear in the sitemap.

------------------------------------------------------------------------

# 46. Robots

Create:

``` text
/robots.txt
```

The public website should be indexable.

The admin application should not be indexed.

Example concept:

``` text
User-agent: *
Disallow: /admin/
```

If admin is hosted on a separate subdomain, configure the admin
application's robots policy accordingly.

------------------------------------------------------------------------

# 47. Performance

Requirements:

-   Lazy-load article images
-   Optimize images
-   Prefer WebP where practical
-   Avoid unnecessary JavaScript
-   Load only required Firestore data
-   Use pagination or limits
-   Avoid fetching full article content for article cards
-   Cache static assets
-   Use loading states
-   Use skeletons where appropriate

Homepage should not download every article's full Markdown content.

------------------------------------------------------------------------

# 48. Responsive Design

Support:

-   Mobile
-   Tablet
-   Laptop
-   Large desktop

Breakpoints should be designed around layout needs rather than arbitrary
device names.

Important mobile requirements:

-   No horizontal scrolling
-   Comfortable reading width
-   Touch-friendly buttons
-   Responsive images
-   Mobile navbar
-   Editor/preview tabs
-   Comfortable code blocks
-   Responsive metadata
-   Responsive article navigation

------------------------------------------------------------------------

# 49. Accessibility

Implement:

-   Semantic HTML
-   Proper heading hierarchy
-   Accessible form labels
-   Keyboard navigation
-   Visible focus states
-   Alt text for images
-   Accessible buttons
-   Accessible validation errors
-   Sufficient text/background contrast
-   Reduced-motion consideration

Do not rely only on color to communicate status.

------------------------------------------------------------------------

# 50. Animation

Keep animations subtle.

Allowed:

-   Fade
-   Small slide
-   Hover transitions
-   Slight image zoom
-   Reading progress indicator
-   Small button transitions

Avoid:

-   Excessive bouncing
-   Huge scroll animations
-   Flashing effects
-   Constant animated gradients
-   Distracting particle effects
-   Long transition delays

The design should feel premium rather than flashy.

------------------------------------------------------------------------

# 51. Error, Loading, and Empty States

Every major data-driven page should have:

### Loading state

``` text
Loading articles...
```

Prefer skeleton UI where appropriate.

### Error state

``` text
Something went wrong.

[ Try Again ]
```

### Empty state

Example:

``` text
No articles published yet.
```

Admin empty state:

``` text
You haven't written any articles yet.

[ Write Your First Article ]
```

------------------------------------------------------------------------

# 52. Firestore Query Strategy

Public homepage:

-   Fetch only published articles
-   Limit results
-   Sort by `publishedAt`
-   Fetch only required fields where practical

Article page:

-   Query article by slug
-   Verify status is `published`

Category page:

-   Query published articles for the category

Admin:

-   Query all articles
-   Filter by status
-   Sort by updated date

Create required Firestore indexes when queries require them.

------------------------------------------------------------------------

# 53. Security Principles

Never rely only on frontend checks.

The following must be enforced at the Firebase level:

``` text
Public:
  Read published articles only

Admin:
  Full article access

Unauthenticated:
  No write access

Non-admin authenticated user:
  No admin write access

Storage:
  Admin-only writes
```

Admin privileges should be verified through the authenticated user's
authorized role.

------------------------------------------------------------------------

# 54. Design System

Create reusable components before building every page independently.

Public components:

``` text
Navbar
Footer
ArticleCard
FeaturedArticle
CategoryBadge
Tag
SearchBar
ArticleMeta
ArticleHeader
MarkdownRenderer
CodeBlock
RelatedArticles
ArticleNavigation
ReadingProgress
```

Admin components:

``` text
AdminSidebar
Topbar
StatCard
ArticleTable
StatusBadge
ArticleEditor
MarkdownEditor
MarkdownPreview
MetadataPanel
ImageUploader
SaveIndicator
ConfirmDialog
Toast
```

------------------------------------------------------------------------

# 55. Shared Design Tokens

Create centralized tokens for:

-   Colors
-   Typography
-   Spacing
-   Border radius
-   Shadows
-   Transitions
-   Breakpoints

Do not scatter raw colors throughout components.

The exact brand gradient must remain centralized:

``` css
--brand-gradient: linear-gradient(
  220.55deg,
  #FF0000 0%,
  #470000 100%
);
```

------------------------------------------------------------------------

# 56. Recommended Implementation Phases

## Phase 1 --- Architecture and Specification

Before implementation:

-   Review requirements
-   Confirm folder structure
-   Confirm routes
-   Confirm Firebase data model
-   Confirm security model
-   Confirm design tokens
-   Confirm deployment strategy

Do not generate unnecessary code during this phase.

------------------------------------------------------------------------

## Phase 2 --- Firebase Foundation

Set up:

-   Firebase project
-   Authentication
-   Firestore
-   Storage
-   Firebase configuration
-   Security rules
-   Indexes

Create initial admin user.

Test Firebase access independently.

------------------------------------------------------------------------

## Phase 3 --- Project Initialization

Create:

``` text
public-site/
admin-site/
```

Configure:

-   React
-   TypeScript
-   Vite
-   Tailwind
-   React Router
-   Firebase SDK
-   ESLint
-   Formatting/linting

Ensure both applications start independently.

------------------------------------------------------------------------

## Phase 4 --- Design System

Implement:

-   Color tokens
-   Exact brand gradient
-   Typography
-   Buttons
-   Inputs
-   Cards
-   Badges
-   Navigation
-   Responsive utilities

Build the visual foundation before implementing all pages.

------------------------------------------------------------------------

## Phase 5 --- Authentication

Implement:

-   Admin login
-   Firebase Auth
-   Protected routes
-   Admin role verification
-   Logout
-   Auth state persistence
-   Login errors

Test unauthorized access.

------------------------------------------------------------------------

## Phase 6 --- Admin CMS CRUD

Implement:

-   Article list
-   Create article
-   Edit article
-   Delete/archive
-   Draft saving
-   Publishing
-   Unpublishing
-   Categories
-   Tags

Test every CRUD operation against Firebase Security Rules.

------------------------------------------------------------------------

## Phase 7 --- Article Editor

Implement:

-   Markdown editor
-   Preview
-   Metadata panel
-   Cover upload
-   Article image upload
-   Auto-save
-   Save status
-   Slug generation
-   Reading time
-   SEO fields
-   Unsaved changes warning

------------------------------------------------------------------------

## Phase 8 --- Admin Dashboard

Implement:

-   Statistics
-   Recent articles
-   Quick actions
-   Article status filters
-   Sidebar
-   Settings

Keep the dashboard lightweight.

------------------------------------------------------------------------

## Phase 9 --- Public Blog

Implement:

-   Navbar
-   Homepage
-   Featured article
-   Latest articles
-   Categories
-   Articles page
-   Search
-   About page
-   Footer
-   404 page

------------------------------------------------------------------------

## Phase 10 --- Article Experience

Implement:

-   Article page
-   Markdown rendering
-   Syntax highlighting
-   Images
-   Code blocks
-   Tags
-   Related articles
-   Previous/next navigation
-   Reading progress

Prioritize mobile reading experience.

------------------------------------------------------------------------

## Phase 11 --- SEO

Implement:

-   Dynamic metadata
-   Canonical URLs
-   Open Graph
-   Article structured data
-   Sitemap
-   Robots
-   Semantic HTML

Test generated metadata on multiple pages.

------------------------------------------------------------------------

## Phase 12 --- Security Audit

Verify:

-   Anonymous users cannot write
-   Anonymous users cannot read drafts
-   Admin can manage articles
-   Unauthorized users cannot access CMS
-   Storage writes require admin authentication
-   Deleted/unpublished articles disappear from public views
-   Firestore rules cannot be bypassed through the client

------------------------------------------------------------------------

## Phase 13 --- Performance Audit

Check:

-   Initial page load
-   Firestore query count
-   Image sizes
-   JavaScript bundle size
-   Lazy loading
-   Unnecessary re-renders
-   Mobile performance
-   Article rendering

Avoid optimizing prematurely, but fix clear bottlenecks before launch.

------------------------------------------------------------------------

## Phase 14 --- Responsive and Accessibility Audit

Test:

-   Mobile
-   Tablet
-   Laptop
-   Large desktop

Test:

-   Keyboard navigation
-   Focus states
-   Screen-reader semantics
-   Form errors
-   Contrast
-   Image alt text
-   Responsive editor
-   Responsive article pages

------------------------------------------------------------------------

## Phase 15 --- Deployment

Recommended structure:

``` text
Firebase Project
│
├── Authentication
├── Firestore
└── Storage

yourdomain.com
        ↓
Public Site

admin.yourdomain.com
        ↓
Admin Site
```

Deployment options:

### Option A --- Vercel

``` text
yourdomain.com       → Public Vercel project
admin.yourdomain.com → Admin Vercel project
```

Firebase remains the backend.

### Option B --- Firebase Hosting

Host both applications through Firebase Hosting with separate hosting
targets.

Choose one deployment approach and keep it consistent.

------------------------------------------------------------------------

# 57. Domain Setup

Recommended:

``` text
yourdomain.com
```

Public:

``` text
yourdomain.com
```

Admin:

``` text
admin.yourdomain.com
```

Do not expose the CMS under a prominent public navigation link.

The admin URL is not a security mechanism; Firebase authentication and
authorization remain the real security layer.

------------------------------------------------------------------------

# 58. Environment Variables

Do not hard-code environment-specific configuration.

Example:

``` text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Important:

Firebase web configuration values are not treated as passwords. Security
must come from Firebase Authentication and Security Rules.

Never expose:

-   Service account private keys
-   Firebase Admin SDK credentials
-   Private API secrets

in the frontend.

------------------------------------------------------------------------

# 59. Testing Strategy

Test at three levels.

## Functional testing

Verify:

-   Login
-   Logout
-   Create article
-   Save draft
-   Edit article
-   Publish
-   Unpublish
-   Delete/archive
-   Image upload
-   Category filtering
-   Search
-   Article reading

## Security testing

Verify:

-   Anonymous read of published content
-   Anonymous rejection of drafts
-   Anonymous write rejection
-   Unauthorized admin route access
-   Storage write rejection
-   Admin write access

## UI testing

Verify:

-   Responsive layout
-   Typography
-   Gradient
-   Buttons
-   Forms
-   Editor
-   Markdown rendering
-   Loading states
-   Empty states
-   Error states

------------------------------------------------------------------------

# 60. Content Architecture

The blog should support content such as:

``` text
AI
Data Analytics
Programming
Web Development
Projects
Career
Learning
Technology
Ideas
```

Do not hard-code these permanently into the frontend.

Categories should ultimately come from Firestore so they can be managed
through the admin panel.

------------------------------------------------------------------------

# 61. Future Features

Do not implement these in V1 unless required.

Possible future additions:

-   Comments
-   Newsletter
-   RSS feed
-   Social sharing analytics
-   View counters
-   Firebase Analytics
-   Search engine integration
-   Related-content recommendation engine
-   Draft scheduling
-   Multiple authors
-   Admin roles
-   Rich media
-   Audio/video articles
-   Newsletter integration
-   Email notifications
-   AI-assisted writing
-   AI article summaries
-   Content analytics
-   Custom domain-based email

Keep the initial architecture extensible enough to support them later.

------------------------------------------------------------------------

# 62. Antigravity Implementation Workflow

Use Antigravity incrementally rather than asking it to generate the
entire system in one operation.

Recommended sequence:

``` text
Prompt 1
Architecture analysis
        ↓
Prompt 2
Firebase setup + schema + security
        ↓
Prompt 3
Authentication
        ↓
Prompt 4
Admin CRUD
        ↓
Prompt 5
Admin editor
        ↓
Prompt 6
Public website
        ↓
Prompt 7
Article experience
        ↓
Prompt 8
SEO
        ↓
Prompt 9
Security/performance audit
        ↓
Prompt 10
Deployment
```

After each phase:

1.  Run the application.
2.  Inspect the implementation.
3.  Test the relevant functionality.
4.  Fix errors.
5.  Only then continue to the next phase.

------------------------------------------------------------------------

# 63. Master Development Rules for Antigravity

When implementing the project:

1.  Do not build the entire system blindly in one pass.
2.  Work phase-by-phase.
3.  Preserve existing working functionality.
4.  Do not replace working architecture without a reason.
5.  Use TypeScript throughout.
6.  Keep components reusable.
7.  Keep Firebase logic separated from UI components.
8.  Use environment variables for configuration.
9.  Never place Firebase Admin credentials in frontend code.
10. Enforce authorization through Firebase Security Rules.
11. Never expose drafts publicly.
12. Do not introduce a custom backend unless necessary.
13. Keep the public and admin applications visually distinct.
14. Use the exact brand gradient:
    `linear-gradient(220.55deg, #FF0000 0%, #470000 100%)`
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

------------------------------------------------------------------------

# 64. Definition of Done

The project is ready for V1 launch when all of the following work:

### Firebase

-   [ ] Authentication works
-   [ ] Firestore works
-   [ ] Storage works
-   [ ] Security rules tested
-   [ ] Required indexes configured

### Admin

-   [ ] Login works
-   [ ] Protected routes work
-   [ ] Dashboard works
-   [ ] Create article works
-   [ ] Edit article works
-   [ ] Drafts work
-   [ ] Preview works
-   [ ] Image uploads work
-   [ ] Publish works
-   [ ] Unpublish works
-   [ ] Delete/archive works
-   [ ] Categories work
-   [ ] Tags work
-   [ ] SEO metadata works

### Public

-   [ ] Homepage works
-   [ ] Articles page works
-   [ ] Article page works
-   [ ] Category pages work
-   [ ] Search works
-   [ ] About page works
-   [ ] 404 page works
-   [ ] Only published content is visible

### Design

-   [ ] Exact red gradient implemented
-   [ ] Dark editorial public theme
-   [ ] Light admin workspace
-   [ ] Responsive layout
-   [ ] Typography system implemented
-   [ ] Subtle animations
-   [ ] Accessible UI

### SEO

-   [ ] Dynamic titles
-   [ ] Meta descriptions
-   [ ] Canonical URLs
-   [ ] Open Graph metadata
-   [ ] Article structured data
-   [ ] Sitemap
-   [ ] Robots configuration

### Quality

-   [ ] Mobile tested
-   [ ] Desktop tested
-   [ ] Security tested
-   [ ] Performance reviewed
-   [ ] Accessibility reviewed
-   [ ] Error states handled
-   [ ] Loading states handled
-   [ ] Empty states handled
-   [ ] Production deployment verified

------------------------------------------------------------------------

# 65. Final Product Vision

The finished platform should feel like a **personal technical
publication with a professional private publishing system behind it**.

The public experience should communicate:

``` text
Dark
Editorial
Technical
Bold
Minimal
Premium
```

The admin experience should communicate:

``` text
Clean
Focused
Fast
Organized
Comfortable for writing
```

The visual identity should consistently use:

``` css
linear-gradient(220.55deg, #FF0000 0%, #470000 100%);
```

as the core brand signature while keeping the overall interface
restrained.

The technical foundation should remain simple:

``` text
React + TypeScript + Vite
             +
Firebase Auth
             +
Firestore
             +
Firebase Storage
```

with no unnecessary backend complexity in V1.

The architecture should make it straightforward to evolve the blog later
into a larger personal publishing platform without needing to rebuild
the foundation.
