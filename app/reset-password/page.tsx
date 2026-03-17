// app/login/page.tsx
import { Suspense } from "react";
import ResetPasswordPage from "./resetUI"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}