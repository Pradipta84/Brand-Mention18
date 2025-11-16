export default function GDPRPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">GDPR Compliance</h1>
        <p className="mt-2 text-slate-600">Your data protection rights</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your Rights</h2>
          <p className="text-slate-600 mb-2">
            Under GDPR, you have the right to:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Data Processing</h2>
          <p className="text-slate-600">
            We process your personal data in accordance with GDPR requirements and only for 
            specified, explicit, and legitimate purposes.
          </p>
        </section>
      </div>
    </div>
  );
}

