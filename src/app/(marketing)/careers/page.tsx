export default function CareersPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Careers</h1>
        <p className="mt-2 text-slate-600">Join the Brand Watch team</p>
      </header>

      <div className="space-y-4">
        {["Senior Software Engineer", "Product Manager", "Data Scientist", "Customer Success Manager"].map((role) => (
          <div key={role} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{role}</h2>
            <p className="text-sm text-slate-600">Full-time • Remote</p>
          </div>
        ))}
      </div>
    </div>
  );
}

