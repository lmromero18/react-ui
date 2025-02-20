"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginService } from "./login-service";
import { useModelBinding } from "../crud-maker/model/use-model-binding";
import { useState } from "react";

export function LoginForm() {
  const { formData, handleChange, model, errors, isValid, values, touched, setTouched } = useModelBinding(new LoginService());
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Por favor, corrige los errores antes de continuar.");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...values,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Usuario o contraseña incorrectos");
      } else {
        router.replace(result?.url || "/dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}

        {model.attributes.map((attr) => (
          <div key={attr.name}>
            <Label htmlFor={attr.name}>{attr.label}</Label>
            <Input
              id={attr.name}
              type={attr.input?.type || "text"}
              value={formData[attr.name] || ""}
              onChange={(e) => handleChange(attr.name, e.target.value)}
              required={attr.input?.required}
              onInput={(e) => handleChange(attr.name, e.currentTarget.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, [attr.name]: true }))}
            />
            {touched[attr.name] && errors[attr.name] && (
              <p className="text-red-500 text-sm">{errors[attr.name]}</p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={!isValid || model.loading}>
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
