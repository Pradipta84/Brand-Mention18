import { SettingsClient } from "./settings-client";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Configuration
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Settings
        </h1>
      </header>

      <SettingsClient />
    </div>
  );
}

