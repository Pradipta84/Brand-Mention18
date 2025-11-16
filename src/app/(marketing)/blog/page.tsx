export default function BlogPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Blog</h1>
        <p className="mt-2 text-slate-600">Latest insights and updates</p>
      </header>

      <div className="space-y-6">
        {[
          "How to Build a Strong Brand Reputation in 2025",
          "The Future of AI-Powered Sentiment Analysis",
          "5 Ways to Monitor Your Brand Online",
        ].map((title) => (
          <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
            <p className="text-sm text-slate-500">Published on {new Date().toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

