export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">About Us</h1>
        <p className="mt-2 text-slate-600">Learn more about Brand Watch</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <p className="text-slate-600">
          Brand Watch is a leading brand reputation monitoring platform powered by advanced AI technology. 
          We help businesses track, analyze, and protect their brand across all digital channels.
        </p>
        <p className="text-slate-600">
          Founded in 2020, we've helped thousands of companies maintain a positive online presence 
          and respond quickly to brand-related issues.
        </p>
      </div>
    </div>
  );
}

