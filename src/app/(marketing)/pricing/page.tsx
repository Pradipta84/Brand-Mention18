export default function PricingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Pricing</h1>
        <p className="mt-2 text-slate-600">Choose the plan that fits your needs</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-slate-900">Free</h2>
            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">FREE</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-4">$0<span className="text-lg text-slate-600">/mo</span></p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Up to 700 mentions/month</li>
            <li>• Basic sentiment analysis</li>
            <li>• Community support</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Starter</h2>
          <p className="text-3xl font-bold text-slate-900 mb-4">$99<span className="text-lg text-slate-600">/mo</span></p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Up to 10,000 mentions/month</li>
            <li>• Basic sentiment analysis</li>
            <li>• Email support</li>
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Professional</h2>
          <p className="text-3xl font-bold text-slate-900 mb-4">$299<span className="text-lg text-slate-600">/mo</span></p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Up to 100,000 mentions/month</li>
            <li>• Advanced AI sentiment</li>
            <li>• Priority support</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h2>
          <p className="text-3xl font-bold text-slate-900 mb-4">Custom</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Unlimited mentions</li>
            <li>• Custom integrations</li>
            <li>• Dedicated support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

