"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginService } from "../login/login-service";

export function LoginForm() {
  const [model] = useState(new LoginService()); // ✅ Estado para el modelo (se mantiene entre renders)
  const router = useRouter();
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(model.attributes.map((attr) => [attr.name, attr.input?.value || ""]))
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Sincroniza valores entre `formData` y el modelo después del primer render
    model.attributes.forEach((attr) => {
      model.setAttributeValue(attr.name, formData[attr.name] || "");
    });
  }, [formData]);

  // ⚡ Maneja cambios en los inputs y actualiza el modelo
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    model.setAttributeValue(name, value); // ✅ Asegura que el modelo también se actualiza
  };

  // 🛠 Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const email = model.getAttribute("email")?.input?.value; // 🔹 "username" en lugar de "email"
      const password = model.getAttribute("password")?.input?.value;

      console.log("📩 Enviando credenciales:", { email, password });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
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
            />
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={model.loading}>
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
