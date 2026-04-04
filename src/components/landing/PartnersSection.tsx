const partners = [
  "Local NGOs",
  "Citizen Response Teams",
  "Disaster Relief Networks",
  "Health & Safety Services",
];

export function PartnersSection() {
  return (
    <section className="border-t py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Trusted network</p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-foreground sm:text-4xl">Built for organizations that move quickly.</h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-muted-foreground">
              SahyogAI is designed to be used by field teams, coordination centers, and civic leaders who need fast, reliable insights.
            </p>
          </div>
          <div className="grid gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
            {partners.map((label) => (
              <div key={label} className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-border/50 bg-background/80 px-3 py-3 sm:px-4 sm:py-4">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Partner</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
