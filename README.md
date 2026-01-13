![alt text](/public/image.png)

# FairGrade

A clinical rotation assessment system for medical students where authorized consultants grade their assigned students on standardized criteria.

## Overview

FairGrade is a full-stack web application designed to streamline the assessment process for medical students during their clinical rotations. The system manages student assignments, consultant evaluations, and grading workflows for a single medical specialty (for now).

### Key Features

- **Hierarchical Organization**: Classes → Rotation Groups (A-F) → Units → Students
- **Role-Based Access**: Lead consultants (admin) and regular consultants with scoped permissions
- **Consultant Management**: Invitation-based registration with email whitelist authorization
- **Student Management**: Individual and bulk Excel import with validation
- **Assessment System**: Five standardized grading criteria with automatic scoring
- **Soft Deletes**: Preserve historical data when consultants are removed
- **Mobile-First**: Responsive design optimized for consultant grading workflow

## Tech Stack

### Core Framework
- **Nuxt 4** - Full-stack Vue framework with TypeScript
- **Vue 3** - Composition API with `<script setup>`
- **ShadCN-Vue** - Accessible component system built on Radix Vue
- **Tailwind CSS** - Utility-first styling

### Backend
- **Neon PostgreSQL** - Serverless database (0.5GB free tier)
- **Drizzle ORM** - Type-safe database queries with automatic migrations
- **Zod** - Runtime validation for API endpoints
- **Better Auth** - Authentication with Google OAuth and Magic Link

### Infrastructure
- **Dokploy** - Deployment and hosting
- **Resend** - Transactional email service (consultant invitations)

## Database Schema

### Core Entities

```typescript
// Academic structure
classes              // Academic years (e.g., "2024-2025")
├── rotation_groups  // 6-week periods (Groups A-F)
│   └── units        // Small groups (4-5 students per consultant)
│       └── students // Medical students

// People
consultants          // Instructors with admin or consultant roles
├── user            // Better Auth accounts (linked after invitation)

// Assessments
assessments         // One per student per year with 5 criteria
```


## Project Structure

```
fairgrade/
├── app/
│   └── lib/
│       └── database/        # Drizzle ORM configuration
│           ├── schema/      # Table definitions
│           └── migrations/  # Database migrations
├── components/
│   ├── ui/                 # ShadCN component library
│   ├── dashboard/          # Dashboard-specific components
│   ├── students/           # Student management components
│   └── consultants/        # Consultant management components
├── pages/
│   ├── dashboard/          # Lead consultant admin pages
│   │   ├── class/         # Class and group management
│   │   ├── consultants/   # Consultant management
│   │   └── students/      # Student management
│   ├── grading/           # Consultant assessment interface
│   └── unauthorized.vue   # Access denied page
├── server/
│   ├── api/               # File-based API routes
│   │   ├── classes/
│   │   ├── consultants/
│   │   ├── students/
│   │   ├── units/
│   │   └── assessments/
│   ├── database/
│   │   └── schema/        # Database schema definitions
│   ├── middleware/
│   │   └── auth.ts        # Authentication & authorization
│   └── utils/
│       ├── auth.ts        # Better Auth configuration
│       └── email-client.ts # Resend email client
└── types/                 # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Neon PostgreSQL account
- Resend account (for email invitations)
- Google OAuth credentials (optional)


## User Roles & Workflows

### Lead Consultant (Admin)

**Capabilities:**
- Create and manage academic years (classes)
- Set up rotation groups with 6-week schedules
- Create units and assign consultants
- Import students via Excel or add individually
- Assign students to units
- Invite and manage consultants
- View all assessments across all units
- Edit locked assessments
- Export data to Excel

**Typical Workflow:**
1. Create new academic year
2. Set rotation dates for groups A-F
3. Create units for each hospital/specialty area
4. Invite consultants and assign them to units
5. Import student roster via Excel
6. Assign students to appropriate units
7. Monitor grading progress throughout year

### Regular Consultant

**Capabilities:**
- View only assigned students
- Submit assessments (5 criteria + notes)
- Lock assessments after submission
- Cannot edit locked assessments
- Mobile-optimized grading interface

**Typical Workflow:**
1. Receive email invitation
2. Sign in via Magic Link or Google OAuth
3. View assigned students in their unit
4. Grade each student on 5 criteria
5. Submit and lock assessment
6. System auto-calculates final score

## Authentication & Authorization

### Invitation System

FairGrade uses an invitation-first workflow:

1. Lead consultant creates consultant record (email + name + role)
2. System sends invitation email via Resend
3. Consultant clicks link and signs in (Magic Link or Google OAuth)
4. On first login, system automatically links auth account to consultant record

### Email Whitelist

Only emails present in the `consultants` table can access the application. Unauthorized users are redirected to `/unauthorized`.


## Key Features

### Bulk Student Import

- Excel file upload
- Automatic column detection (First Name, Last Name, Student ID)
- Flexible column name matching
- Row-by-row validation preview
- Shows valid/duplicate/invalid rows
- Imports successful rows, reports failures
- Validates duplicate student IDs


### Dynamic Class Filtering

- All API calls scoped to active class by default
- Users can switch between academic years
- Data properly isolated per class

### Assessment Locking

- Lead consultants can edit any assessment
- Regular consultants cannot edit after submission
- Protects data integrity

## API Endpoints

### Classes
- `GET /api/classes` - List all classes
- `POST /api/classes` - Create class (auto-creates 6 rotation groups)
- `GET /api/classes/[id]` - Get single class with groups
- `PATCH /api/classes/[id]` - Update class
- `DELETE /api/classes/[id]` - Delete class (cascade)

### Rotation Groups
- `GET /api/rotation-groups` - List groups (filtered by class)
- `PATCH /api/rotation-groups/[id]` - Update dates

### Units
- `GET /api/units` - List units (filtered by class)
- `POST /api/units` - Create unit
- `PATCH /api/units/[id]` - Update unit
- `DELETE /api/units/[id]` - Delete unit

### Students
- `GET /api/students` - List students (filtered by class)
- `POST /api/students` - Create single student
- `POST /api/students/bulk` - Bulk import with validation
- `PATCH /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Consultants
- `GET /api/consultants` - List active consultants
- `POST /api/consultants` - Create consultant + send invite
- `PATCH /api/consultants/[id]` - Update consultant
- `DELETE /api/consultants/[id]` - Soft delete

### Assessments
- `GET /api/assessments` - List assessments (scoped by role)
- `POST /api/assessments` - Create assessment
- `PATCH /api/assessments/[id]` - Update assessment
- `GET /api/assessments/stats` - Dashboard statistics

All endpoints include proper error handling, validation, and appropriate HTTP status codes (200, 201, 400, 404, 409, 500).

## Development Patterns

### Type Safety

- TypeScript throughout
- Zod validation schemas in `server/utils/validation/`
- Shared types in `/types/`
- Avoid `any` types - use proper inference or explicit types

### Data Fetching

- Centralized data fetching in dashboard layouts
- Vue's provide/inject for sharing data with child components
- `useFetch` for API calls with proper error handling
- Loading states and toast notifications


### Database Operations

- Use Drizzle's type-safe query builder
- Leverage foreign key constraints
- Handle constraint violations with specific error messages
- Soft delete where historical data matters


### Planned Features
- [ ] Excel export for assessment reports
- [ ] Consultant activity audit logs
- [ ] Student self-service portal (view own assessments)
- [ ] Email notifications for pending assessments
- [ ] Bulk unit creation with CSV
- [ ] Assessment comment templates
- [ ] Historical data archiving

### Technical Debt
- [ ] Add request rate limiting
- [ ] Implement comprehensive logging
- [ ] Add E2E tests with Playwright
- [ ] Set up CI/CD pipeline
- [ ] Database backup automation
- [ ] Performance monitoring

## Contributing

This is currently a private project for a specific medical education institution. If you're interested in adapting it for your institution, please reach out.

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team or create an issue in this repository.

---

**Version:** 0.4.0  
**Last Updated:** January 2026  