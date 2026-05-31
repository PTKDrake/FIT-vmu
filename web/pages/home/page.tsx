import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";

export default function HomePage() {
  return (
    <>
      <Head title="Home" />
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-fg">VMUFit</h1>
        <p className="text-muted-fg">
          A Laravel + Inertia application using the `web/` frontend structure
          and action-based backend flows.
        </p>
      </section>
    </>
  );
}

HomePage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
