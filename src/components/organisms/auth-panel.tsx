"use client";

import type { ComponentPropsWithoutRef, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Logo } from "@/components/atoms/logo";
import { Field } from "@/components/molecules/field";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

export type AuthMode = "login" | "register";

export type AuthPanelProps = ComponentPropsWithoutRef<"div"> & {
  mode: AuthMode;
};

/** Email/password auth composition backed by Better Auth. */
export function AuthPanel({ className, mode, ...props }: AuthPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    try {
      const result = isRegister
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Não foi possível autenticar.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={cn("w-full max-w-147.5 p-8 md:p-10", className)} {...props}>
      <div className="grid gap-8">
        <div className="grid gap-8">
          <Logo className="[&_span:last-child]:text-[22px]" />
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isRegister ? "Crie sua conta" : "Bem-vindo de volta"}
            </h1>
            <p className="max-w-105 text-sm leading-normal text-muted-foreground">
              {isRegister
                ? "Cadastre-se para começar a criar e publicar sites estáticos."
                : "Entre para acessar sua plataforma de criação de sites."}
            </p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          {isRegister ? (
            <Field label="Nome">
              <Input autoComplete="name" minLength={2} name="name" placeholder="Seu nome" required type="text" />
            </Field>
          ) : null}
          <Field label="E-mail">
            <Input autoComplete="email" name="email" placeholder="seu@email.com" required type="email" />
          </Field>
          <Field label="Senha">
            <Input
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </Field>
          {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-destructive">{error}</p> : null}
          <Button className="h-11 w-full" disabled={isPending} type="submit">
            {isPending ? "Aguarde..." : isRegister ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <Link className="text-center text-[13px] text-primary hover:underline" href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se"}
        </Link>
      </div>
    </div>
  );
}
