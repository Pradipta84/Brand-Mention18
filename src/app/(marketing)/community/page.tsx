export default function CommunityPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Community</h1>
        <p className="mt-2 text-slate-600">Join our community of brand managers</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {["Discord", "Forum", "User Groups", "Events"].map((name) => (
          <div key={name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
            <p className="mt-2 text-sm text-slate-600">Connect with other users</p>
          </div>
        ))}
      </div>
    </div>
  );
}

