import { Head, usePage } from "@inertiajs/react"
import type { ReactNode } from "react"
import AppLayout from "@/layouts/app-layout"
import type { SharedData } from "@/types/shared"

export default function DashboardPage() {
  const { auth } = usePage<SharedData>().props

  return (
    <>
      <Head title="Dashboard" />
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-slate-600">
          {auth.user ? `Hello, ${auth.user.name}.` : "Welcome back."}
        </p>
      </section>
    </>
  )
}

DashboardPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
