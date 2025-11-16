export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Information We Collect</h2>
          <p className="text-slate-600">
            We collect information that you provide directly to us, including account information, 
            usage data, and content you submit through our services.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">How We Use Your Information</h2>
          <p className="text-slate-600">
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, and communicate with you.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Data Security</h2>
          <p className="text-slate-600">
            We implement appropriate technical and organizational measures to protect your personal information.
          </p>
        </section>
      </div>
    </div>
  );
}

