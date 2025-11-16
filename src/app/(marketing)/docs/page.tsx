export default function DocsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Documentation</h1>
        <p className="mt-2 text-slate-600">Complete guide to using Brand Watch</p>
      </header>

      <div className="space-y-4">
        {[
          "Getting Started",
          "Dashboard Overview",
          "Setting Up Alerts",
          "API Reference",
          "Best Practices",
        ].map((title) => (
          <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

