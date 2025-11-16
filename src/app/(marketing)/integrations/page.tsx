export default function IntegrationsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Integrations</h1>
        <p className="mt-2 text-slate-600">Connect Brand Watch with your favorite tools</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {["Slack", "Microsoft Teams", "Jira", "Zendesk", "Salesforce", "HubSpot"].map((name) => (
          <div key={name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
            <p className="mt-2 text-sm text-slate-600">Seamlessly integrate with {name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

