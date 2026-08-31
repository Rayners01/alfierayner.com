import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | Alfie Rayner",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Already signed in
  if (await getSessionUser()) redirect("/");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[image:var(--art-page)] p-4">
      <LoginForm />
    </main>
  );
}
