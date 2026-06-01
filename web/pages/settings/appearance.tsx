import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/hooks/use-theme";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/pages/settings/settings-layout";

const options: Theme[] = ["light", "dark", "system"];

const optionLabels: Record<Theme, string> = {
  light: "Sáng",
  dark: "Tối",
  system: "Theo hệ thống",
};

export default function AppearancePage() {
  const { theme, updateTheme } = useTheme();

  return (
    <>
      <Head title="Giao diện" />
      <div className="space-y-6 rounded-xl border border-border bg-overlay p-6">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Giao diện</h1>
          <p className="text-sm text-muted-fg">
            Chọn cách giao diện hiển thị phù hợp với bạn.
          </p>
        </div>

        <div className="flex gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateTheme(option)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                theme === option
                  ? "bg-primary text-primary-fg"
                  : "bg-muted text-muted-fg hover:text-fg"
              }`}
            >
              {optionLabels[option]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

AppearancePage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
);
