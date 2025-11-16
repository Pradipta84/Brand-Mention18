export default function ApiDocsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">API Documentation</h1>
        <p className="mt-2 text-slate-600">Build with Brand Watch API</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Authentication</h3>
            <p className="text-sm text-slate-600">Use API keys to authenticate your requests.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Endpoints</h3>
            <p className="text-sm text-slate-600">RESTful API with comprehensive endpoints for mentions, sentiment, and analytics.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Rate Limits</h3>
            <p className="text-sm text-slate-600">1000 requests per hour for standard plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

