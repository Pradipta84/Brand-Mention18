export default function CookiesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Cookie Policy</h1>
        <p className="mt-2 text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">What Are Cookies</h2>
          <p className="text-slate-600">
            Cookies are small text files that are placed on your device when you visit our website.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">How We Use Cookies</h2>
          <p className="text-slate-600">
            We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Managing Cookies</h2>
          <p className="text-slate-600">
            You can control and manage cookies through your browser settings.
          </p>
        </section>
      </div>
    </div>
  );
}

