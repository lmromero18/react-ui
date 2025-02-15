"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { usePathname } from "next/navigation"

// Mapea las rutas con los nombres de página deseados
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/solicitudes": "Solicitudes",
  "/profile": "Perfil",
  "/settings": "Configuración",
}

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "My App"
  const { state, toggleSidebar } = useSidebar()

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b w-full">
      <div className="flex items-center">
        <SidebarTrigger onClick={toggleSidebar} />
        <h1 className="ml-4 text-xl font-semibold">{title}</h1>
      </div>
      <ModeToggle />
    </header>
  )
}

