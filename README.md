# Green Pulse Backend

**A robust, scalable backend API for the Green Pulse platform, designed to handle user authentication, sustainability challenges, member management, and administrative operations.**

## 1. Problem Statement
Organizations and communities often struggle to effectively track, manage, and incentivize environmental and sustainability challenges among their members. There is a need for a centralized, secure system that can handle structured data, manage different user roles, and provide seamless API integrations for modern front-end dashboards to oversee these sustainability initiatives.

## 2. Solution
Green Pulse Backend provides a secure and centralized platform that offers role-based access control, comprehensive challenge tracking, and structured user management. It empowers administrators to create challenges, members to submit their progress, and automates the workflow of reviewing and tracking environmental impact.

## 3. Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth & JSON Web Tokens (JWT)
- **Validation:** Zod
- **File Storage:** Cloudinary & Multer
- **Email Service:** Nodemailer & EJS Templates
- **Package Manager:** pnpm

## 4. Key Features
- **Secure Authentication & Authorization:** Integrated Better Auth and JWT for robust user sessions and security.
- **Role-Based Access Control (RBAC):** Distinct roles and permissions for Super Admins, Admins, Members, and regular Users.
- **Challenge & Submission Management:** APIs to create challenges, handle user submissions, and track participation progress.
- **Media Uploads:** Seamless image and file uploads using Cloudinary and Multer.
- **Automated Email Notifications:** Dynamic email rendering with EJS and reliable delivery via Nodemailer.
- **Type-Safe & Validated:** End-to-end type safety with TypeScript and robust input validation using Zod.
- **Modular Architecture:** Clean, scalable, and maintainable codebase structured into distinct feature modules.

## 5. Setup Instructions

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mehedi-Hasann/green_pulse_backend/tree/main
   cd green-pulse-backend
   ```

2. **Install dependencies:**
   Make sure you have `pnpm` installed.
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and copy the contents from `.env.example`. Fill in the required credentials.

4. **Run Prisma Migrations & Generate Client:**
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Start the Development Server:**
   ```bash
   pnpm dev
   ```
   The server should now be running on `http://localhost:5000` (or the port specified in your `.env`).

## 6. Environment Variables

Create a `.env` file in the root of your project with the following structure:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="xxxxxxxxxxxxxxxxxxx"

BETTER_AUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxx
BETTER_AUTH_URL=xxxxxxxxxxxxxxxxxxxxx

ACCESS_TOKEN_SECRET=xxxxxxxxxxxxxxxxxxxxx
ACCESS_TOKEN_EXPIRES_IN=10d
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=7d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=7d

EMAIL_SENDER_SMTP_USER=example@gmail.com
EMAIL_SENDER_SMTP_PASS=xxxx xxxx xxxx xxxx
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465

GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=xxxxxxxxxxxxxxxxxxxx

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=xxxxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxx
```

## 7. API / Architecture

The application follows a **Modular Pattern Architecture**. Inside the `src/app/module` directory, each feature has its own encapsulated components (Routes, Controllers, Services, Interfaces).

**Base API Endpoints:**
- `/api/v1/auth` - Authentication operations (Login, Register, OAuth)
- `/api/v1/users` - User management operations
- `/api/v1/member` - Member-specific operations
- `/api/v1/category` - Challenge categories management
- `/api/v1/challenge` - Core challenge operations
- `/api/v1/member-challenge` - Handling member enrollments to challenges
- `/api/v1/submissions` - Challenge submission handling
- `/api/v1/admin` - Admin specific controls
- `/api/v1/super-admin` - Super Admin privileges and dashboard metrics

## 8. Live Demo & Credentials

**Live Base API URL:** 
[https://green-pulse-backend-otpm.onrender.com/](https://green-pulse-backend-otpm.onrender.com/)

*(Note: Add `/api/v1/...` to the base URL to access specific endpoints)*
