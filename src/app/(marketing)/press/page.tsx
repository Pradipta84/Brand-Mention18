export default function PressPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Press Kit</h1>
        <p className="mt-2 text-slate-600">Resources for media and press</p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900 mb-2">Media Contact</h2>
          <p className="text-sm text-slate-600">press@brandwatch.com</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 mb-2">Logo & Assets</h2>
          <p className="text-sm text-slate-600">Download our brand assets and logos.</p>
        </div>
      </div>
    </div>
  );
}

