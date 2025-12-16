# Frontend Laboratory App (Labs 6-11)

This project is a Next.js application integrated with Firebase (Authentication, Firestore, Hosting) and Tailwind CSS. It was developed as part of the Frontend Frameworks laboratory course.

**Author:** Student 15178

---

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js (v18 or higher)
-   Git

### 2. Installation
Navigate to the project directory and install dependencies:

```bash
cd frontend-laboratory-app
npm install
```

### 3. Environment Setup (Critical!)
This app uses Firebase. You must create a `.env.local` file in the root of `frontend-laboratory-app` with your own Firebase configuration keys.

**Example `.env.local`:**
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
```
> **Note:** Do not commit this file to GitHub!

### 4. Running Locally
Start the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Testing

The project includes Playwright E2E tests for navigation, authentication, and protected routes.

**Run all tests:**
```bash
npx playwright test
```

**Run UI Mode (Interactive):**
```bash
npx playwright test --ui
```

---

## 📦 Deployment (Firebase Hosting)

To deploy the production build to Firebase:

1.  **Build the application:**
    ```bash
    npm run build
    ```
2.  **Deploy:**
    ```bash
    firebase deploy
    ```

---

## 📂 Project Structure

-   `app/(public)`: Public routes (Login, Register, Verify).
-   `app/(protected)`: Protected routes (Profile, Articles). Required Authentication.
-   `app/components`: Reusable UI components (Layout, Cards, Forms).
-   `app/lib`: Firebase initialization and Authentication Context.
-   `tests/`: Playwright E2E test specifications.
