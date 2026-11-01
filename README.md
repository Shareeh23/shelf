<a id="readme-top"></a>

<div align="center">

# 📚 Shelf

### _Your knowledge, organized._

Shelf is a personal knowledge management application for creating, organizing, and managing learning notes. It provides a centralized space to capture knowledge, organize information by category, and revisit important notes.

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-000000?style=for-the-badge&logo=betterauth&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

<br />

[Features](#features) •
[Tech Stack](#tech-stack) •
[Getting Started](#getting-started) •
[Scripts](#available-scripts) •
[Structure](#project-structure) •
[Architecture](#architecture) •
[Technical Debt](#technical-debt)

</div>

---

<a id="features"></a>

## ✨ Features

### 📝 Note Management

- Create, edit, and delete notes.
- Write notes using Markdown with live preview.
- Organize notes using categories.
- Search notes by title, category, description, and content.
- Preview and edit notes within the dashboard.

### 🗂️ Organization

- Browse all notes.
- View recently updated notes.
- Mark notes as favorites.
- Archive notes you want to keep.
- Move unwanted notes to Trash.
- Navigate through notes using pagination.

### 🔐 Authentication

- Email and password authentication.
- Google OAuth integration.
- Email verification.
- Password reset functionality.
- Protected application routes.
- Server-side session management.

### ⚡ Performance

- User-scoped server-side caching.
- Tag-based cache invalidation.
- Next.js Cache Components.
- Partial Prerendering.
- Suspense boundaries with skeleton loading states.
- URL-synchronized pagination.

<div align="right">

[⬆ Back to top](#readme-top)

</div>

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack

<table width="100%">
  <thead>
    <tr>
      <th align="left" width="40%">Technology</th>
      <th align="left" width="60%">Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://nextjs.org/">Next.js 16</a></td>
      <td>Application framework and routing</td>
    </tr>
    <tr>
      <td><a href="https://react.dev/">React 19</a></td>
      <td>UI library</td>
    </tr>
    <tr>
      <td><a href="https://www.typescriptlang.org/">TypeScript</a></td>
      <td>Type safety</td>
    </tr>
    <tr>
      <td><a href="https://tailwindcss.com/">Tailwind CSS v4</a></td>
      <td>Styling</td>
    </tr>
    <tr>
      <td><a href="https://ui.shadcn.com/">shadcn/ui</a></td>
      <td>UI components</td>
    </tr>
    <tr>
      <td><a href="https://lucide.dev/">Lucide React</a></td>
      <td>Icons</td>
    </tr>
    <tr>
      <td><a href="https://react-hook-form.com/">React Hook Form</a></td>
      <td>Form management</td>
    </tr>
    <tr>
      <td><a href="https://zod.dev/">Zod</a></td>
      <td>Schema validation</td>
    </tr>
    <tr>
      <td><a href="https://github.com/remarkjs/react-markdown">React Markdown</a></td>
      <td>Markdown rendering</td>
    </tr>
    <tr>
      <td><a href="https://github.com/remarkjs/remark-gfm">Remark GFM</a></td>
      <td>GitHub Flavored Markdown</td>
    </tr>
    <tr>
      <td><a href="https://www.better-auth.com/">Better Auth</a></td>
      <td>Authentication</td>
    </tr>
    <tr>
      <td><a href="https://www.sqlite.org/">SQLite</a></td>
      <td>Database</td>
    </tr>
    <tr>
      <td><a href="https://github.com/WiseLibs/better-sqlite3">better-sqlite3</a></td>
      <td>SQLite driver</td>
    </tr>
    <tr>
      <td><a href="https://orm.drizzle.team/">Drizzle ORM</a></td>
      <td>Database queries and schema management</td>
    </tr>
    <tr>
      <td><a href="https://orm.drizzle.team/kit-docs/overview">Drizzle Kit</a></td>
      <td>Database tooling</td>
    </tr>
    <tr>
      <td><a href="https://nodemailer.com/">Nodemailer</a></td>
      <td>Email delivery</td>
    </tr>
    <tr>
      <td><a href="https://pnpm.io/">pnpm</a></td>
      <td>Package management</td>
    </tr>
  </tbody>
</table>

<div align="right">

[⬆ Back to top](#readme-top)

</div>

---

<a id="getting-started"></a>

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9.0 or later
- pnpm 12.15.0
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Shareeh23/shelf.git
   ```

2. Navigate to the project directory:

   ```bash
   cd shelf
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create your environment file:

   ```bash
   cp .env.example .env
   ```

5. Configure the required environment variables.

   These include configuration for:

   - Better Auth
   - Google OAuth
   - Gmail SMTP

   Refer to the authentication and email configuration in `lib/auth/` and `lib/email/` for the required variables.

6. Initialize the database:

  ```bash
  pnpm db:migrate
  ```

7. Start the development server:

   ```bash
   pnpm dev
   ```

8. Open <http://localhost:3000>.

<div align="right">

[⬆ Back to top](#readme-top)

</div>

---

<a id="available-scripts"></a>

## 📜 Available Scripts

<table width="100%">
  <thead>
    <tr>
      <th align="left" width="30%">Command</th>
      <th align="left" width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>pnpm dev</code></td>
      <td>Start the development server</td>
    </tr>
    <tr>
      <td><code>pnpm build</code></td>
      <td>Create an optimized production build</td>
    </tr>
    <tr>
      <td><code>pnpm start</code></td>
      <td>Start the production server</td>
    </tr>
    <tr>
      <td><code>pnpm lint</code></td>
      <td>Run ESLint</td>
    </tr>
    <tr>
      <td><code>pnpm lint:fix</code></td>
      <td>Run ESLint and automatically fix issues</td>
    </tr>
    <tr>
      <td><code>pnpm format</code></td>
      <td>Format TypeScript files with Prettier</td>
    </tr>
    <tr>
      <td><code>pnpm format:check</code></td>
      <td>Check TypeScript file formatting without making changes</td>
    </tr>
    <tr>
      <td><code>pnpm typecheck</code></td>
      <td>Run TypeScript type checking</td>
    </tr>
    <tr>
      <td><code>pnpm check</code></td>
      <td>Run linting, type checking, and format checking</td>
    </tr>
    <tr>
      <td><code>pnpm db:generate</code></td>
      <td>Generate database migrations from the schema</td>
    </tr>
    <tr>
      <td><code>pnpm db:migrate</code></td>
      <td>Apply database migrations</td>
    </tr>
    <tr>
      <td><code>pnpm db:push</code></td>
      <td>Push the schema directly to the database</td>
    </tr>
    <tr>
      <td><code>pnpm db:studio</code></td>
      <td>Open Drizzle Studio</td>
    </tr>
  </tbody>
</table>

<div align="right">

[⬆ Back to top](#readme-top)

</div>

---

<a id="project-structure"></a>

## 🏗️ Project Structure

```text
shelf/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── layout.tsx
│   │
│   ├── (protected)/
│   │   ├── dashboard/
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── notes/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── [...all]/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── home/
│   ├── notes/
│   ├── sidebar/
│   ├── ui/
│   └── theme-provider.tsx
│
├── hooks/
│   └── use-mobile.ts
│
├── lib/
│   ├── auth/
│   │   ├── auth.ts
│   │   └── auth-client.ts
│   │
│   ├── db/
│   │   ├── auth-schema.ts
│   │   ├── notes-schema.ts
│   │   └── index.ts
│   │
│   ├── email/
│   │   ├── templates/
│   │   │   └── password-reset.ts
│   │   └── transporter.ts
│   │
│   ├── notes/
│   │   ├── cache.ts
│   │   ├── note-filters.ts
│   │   └── note-mappers.ts
│   │
│   └── schema/
│       ├── auth.ts
│       └── notes.ts
│
├── types/
│   ├── app-sidebar.ts
│   └── note.ts
│
├── public/
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── TECH_DEBT.md
└── tsconfig.json
```

<div align="right">

[⬆ Back to top](#readme-top)

</div>

---

<a id="architecture"></a>

## 🏛️ Architecture

### Application Routing

Shelf uses the Next.js App Router.

Route groups separate authentication pages from protected application pages:

- `(auth)` contains login, signup, and password recovery pages.
- `(protected)` contains authenticated application pages.
- `api/` contains application API routes and Better Auth handlers.

### Authentication

Authentication is implemented using Better Auth with the Drizzle adapter.

Protected routes perform server-side session validation before rendering their content.

### Database

Shelf uses SQLite with Drizzle ORM.

The database schemas are separated into:

- `auth-schema.ts` – Authentication-related tables, including users, sessions, and accounts.
- `notes-schema.ts` – Note-related database schema.

Database operations use Drizzle's type-safe query interface.

Database configuration and schemas are located in `lib/db/`. Drizzle configuration is maintained in `drizzle.config.ts`. Database commands are listed under [Available Scripts](#available-scripts).

### API Design

The application uses Next.js Route Handlers for backend operations.

Notes API:

<table width="100%">
  <thead>
    <tr>
      <th align="left" width="15%">Method</th>
      <th align="left" width="35%">Endpoint</th>
      <th align="left" width="50%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GET</td>
      <td><code>/api/notes</code></td>
      <td>Retrieve authenticated user's notes</td>
    </tr>
    <tr>
      <td>POST</td>
      <td><code>/api/notes</code></td>
      <td>Create a note</td>
    </tr>
    <tr>
      <td>PATCH</td>
      <td><code>/api/notes/[id]</code></td>
      <td>Update a note</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td><code>/api/notes/[id]</code></td>
      <td>Delete a note</td>
    </tr>
  </tbody>
</table>

API operations enforce authentication and user ownership.

Note creation and updates use Zod validation.

### Server-side Caching

Shelf uses Next.js Cache Components to cache user-specific note queries.

The caching implementation is centralized in:

```text
lib/notes/cache.ts
```

It uses:

- `"use cache"` to cache the database query.
- `cacheLife()` to configure cache lifetime.
- `cacheTag()` to associate cached data with user-specific tags.
- `revalidateTag()` to invalidate cached data.

Each user's notes are associated with a separate cache tag:

```text
user-notes:{userId}
```

Cache invalidation occurs after successful note mutations:

- Creating a note.
- Updating a note.
- Deleting a note.

Because each user has a separate tag, invalidating one user's notes does not invalidate other users' cached notes.

### Rendering Strategy

Shelf uses Next.js Cache Components and Partial Prerendering.

The application combines prerendered content with request-dependent content.

Suspense boundaries isolate operations that require runtime data, including:

- Authentication checks involving request headers and cookies.
- URL search parameter access.

Skeleton components provide loading placeholders while dynamic content is being resolved.

<div align="right">

[⬆ Back to top](#readme-top)

</div>

---

<a id="technical-debt"></a>

## 📝 Technical Debt

Known technical debt and areas for improvement are documented in:

```text
TECH_DEBT.md
```
