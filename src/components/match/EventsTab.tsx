interface Props {
  events: any[];
}

const ICONS: Record<string, string> = {
  Goal: "⚽",
  Card: "🟨",
  subst: "🔄",
  Var: "🖥️",
};

export default function EventsTab({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          Match Events
        </h2>

        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            No Match Events
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Match events are not available for this fixture.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-8 text-xl font-bold text-white">
        Match Timeline
      </h2>

      <div className="relative border-l border-zinc-700 pl-8">
        {events.map((event, index) => {
          const icon =
            ICONS[event.type] ??
            (event.type === "subst" ? "🔄" : "⚽");

          return (
            <div
              key={index}
              className="relative mb-8 last:mb-0"
            >
              <div className="absolute -left-[41px] flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                {icon}
              </div>

              <div className="mb-1 text-sm font-bold text-yellow-400">
                {event.time.elapsed}'
                {event.time.extra
                  ? `+${event.time.extra}`
                  : ""}
              </div>

              <div className="font-semibold text-white">
                {event.team?.name}
              </div>

              <div className="text-sm text-zinc-300">
                {event.player?.name ?? "Unknown Player"}
              </div>

              <div className="mt-1 text-sm text-zinc-500">
                {event.detail}
              </div>

              {event.assist?.name && (
                <div className="mt-1 text-xs text-zinc-500">
                  Assist: {event.assist.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}