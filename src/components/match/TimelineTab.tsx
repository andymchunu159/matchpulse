import {
  ArrowRightLeft,
  Flag,
  ShieldAlert,
  Circle,
} from "lucide-react";

interface Props {
  events: any[];
}

export default function TimelineTab({
  events,
}: Props) {
  if (!events || events.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            No Match Events
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Match events will appear once the fixture begins.
          </p>
        </div>
      </section>
    );
  }

  function EventIcon({
    type,
    detail,
  }: {
    type: string;
    detail: string;
  }) {
    if (type === "Goal") {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-xl">
          ⚽
        </div>
      );
    }

    if (type === "subst") {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
          <ArrowRightLeft
            size={18}
            className="text-blue-400"
          />
        </div>
      );
    }

    if (type === "Card") {
      const red = detail
        ?.toLowerCase()
        .includes("red");

      return (
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            red
              ? "bg-red-500/15"
              : "bg-yellow-500/15"
          }`}
        >
          <ShieldAlert
            size={18}
            className={
              red
                ? "text-red-400"
                : "text-yellow-400"
            }
          />
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
        <Flag
          size={18}
          className="text-zinc-400"
        />
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {events.map((event: any, index: number) => {
        const eventKey = [
          event.time?.elapsed ?? 0,
          event.time?.extra ?? 0,
          event.team?.id ?? 0,
          event.player?.id ?? event.player?.name ?? "unknown",
          event.type ?? "event",
          event.detail ?? "",
          index,
        ].join("-");

        return (
          <div
            key={eventKey}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all duration-300 hover:border-green-500/40 hover:bg-zinc-900"
          >
            <div className="flex gap-4">
              <EventIcon
                type={event.type}
                detail={event.detail ?? ""}
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {event.player?.name ?? "Unknown Player"}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-400">
                      {event.detail}
                    </p>
                  </div>

                  <div className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-bold text-green-400">
                    {event.time?.elapsed}'
                    {event.time?.extra
                      ? `+${event.time.extra}`
                      : ""}
                  </div>
                </div>

                {event.assist?.name && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <Circle
                      size={6}
                      className="fill-current"
                    />

                    Assist: {event.assist.name}
                  </div>
                )}

                {event.comments && (
                  <p className="mt-2 text-xs italic text-zinc-500">
                    {event.comments}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}