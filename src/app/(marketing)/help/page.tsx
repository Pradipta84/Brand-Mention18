export default function HelpPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Help Center</h1>
        <p className="mt-2 text-slate-600">Find answers to common questions</p>
      </header>

      <div className="space-y-4">
        {[
          "How do I set up my first monitor?",
          "What is sentiment analysis?",
          "How do I export my data?",
          "Can I customize my dashboard?",
        ].map((question) => (
          <div key={question} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{question}</h2>
            <p className="text-sm text-slate-600">Find detailed answers in our documentation.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

