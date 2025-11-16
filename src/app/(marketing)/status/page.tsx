export default function StatusPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">System Status</h1>
        <p className="mt-2 text-slate-600">Real-time status of all services</p>
      </header>

      <div className="space-y-4">
        {[
          { name: "API", status: "Operational" },
          { name: "Dashboard", status: "Operational" },
          { name: "Data Processing", status: "Operational" },
          { name: "Notifications", status: "Operational" },
        ].map((service) => (
          <div key={service.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{service.name}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

