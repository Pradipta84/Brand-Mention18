export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing and using Brand Watch, you accept and agree to be bound by these Terms of Service.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Use of Service</h2>
          <p className="text-slate-600">
            You agree to use the service only for lawful purposes and in accordance with these Terms.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Account Responsibility</h2>
          <p className="text-slate-600">
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>
      </div>
    </div>
  );
}

