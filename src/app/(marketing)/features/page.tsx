export default function FeaturesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Features</h1>
        <p className="mt-2 text-slate-600">Discover what Brand Watch can do for your brand</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Real-time Monitoring</h2>
          <p className="text-slate-600">Track mentions across all channels in real-time with instant alerts.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Sentiment</h2>
          <p className="text-slate-600">Advanced sentiment analysis powered by machine learning.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Competitor Analysis</h2>
          <p className="text-slate-600">Monitor and compare your brand against competitors.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Custom Dashboards</h2>
          <p className="text-slate-600">Build personalized dashboards with the metrics that matter.</p>
        </div>
      </div>
    </div>
  );
}

