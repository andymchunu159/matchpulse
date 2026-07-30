import { MapPin, Building2 } from "lucide-react";
import { Fixture } from "@/lib/football";

interface Props {
  fixture: Fixture;
}

export default function VenueCard({
  fixture,
}: Props) {
  const venue = fixture.fixture.venue;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        Venue
      </h2>

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-zinc-800 p-3">
            <Building2
              size={22}
              className="text-green-500"
            />
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Stadium
            </p>

            <p className="text-lg font-semibold text-white">
              {venue?.name ?? "Venue TBA"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-zinc-800 p-3">
            <MapPin
              size={22}
              className="text-green-500"
            />
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              City
            </p>

            <p className="text-lg font-semibold text-white">
              {venue?.city ?? "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}