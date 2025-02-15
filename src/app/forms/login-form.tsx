"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard", // 🔹 Asegura que NextAuth redirija correctamente
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.replace(result?.url || "/dashboard"); // 🔹 Redirige a la ruta protegida
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Log in
      </Button>
    </form>
  )
}

