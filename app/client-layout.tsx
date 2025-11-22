"use client"

import type React from "react"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Providers } from "./providers"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const searchParams = useSearchParams()

  return (
    <>
      <Suspense fallback={null}>
        <Providers>{children}</Providers>
      </Suspense>
      <Analytics />
    </>
  )
}
