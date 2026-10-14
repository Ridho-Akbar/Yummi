"use client";

import { useFormStatus } from "react-dom";
import { signInWithGoogle } from "@/features/auth/actions";
import { Button } from "@/components/ui/Button";

interface SignInButtonProps {
  next?: string;
  label?: string;
}

export function SignInButton({
  next,
  label = "Login dengan Google",
}: SignInButtonProps) {
  return (
    <form action={() => signInWithGoogle(next)}>
      <SubmitButton label={label} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menghubungkan..." : label}
    </Button>
  );
}