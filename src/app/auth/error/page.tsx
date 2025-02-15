"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthError() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p>There was an error during the authentication process.</p>
      <p>You will be redirected to the login page in 5 seconds.</p>
    </div>
  )
}

