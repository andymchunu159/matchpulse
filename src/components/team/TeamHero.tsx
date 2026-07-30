import Image from "next/image";
import {
  CalendarDays,
  Flag,
  MapPin,
  Users,
} from "lucide-react";

interface Props {
  team: any;
}

export default function TeamHero({
  team,
}: Props) {
  const club = team.team;
  const venue = team.venue;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-8">
      {/* Glow */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-center gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <Image
              src={club.logo}
              alt={club.name}
              width={90}
              height={90}
              className="h-auto w-auto"
            />
          </div>

          <div>
            <h1 className="text-4xl font-black text-white">
              {club.name}
            </h1>

            <p className="mt-2 text-zinc-400">
              {team.team.country}
            </p>

            <div className="mt-5 flex flex-wrap gap-5 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-green-400"
                />

                Founded {club.founded}
              </div>

              <div className="flex items-center gap-2">
                <MapPin
                  size={16}
                  className="text-green-400"
                />

                {venue.name}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-4 lg:w-80">
          <InfoCard
            icon={<Flag size={18} />}
            label="Country"
            value={club.country}
          />

          <InfoCard
            icon={<Users size={18} />}
            label="Capacity"
            value={
              venue.capacity?.toLocaleString() ??
              "-"
            }
          />
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-green-400">
        {icon}

        <span className="text-sm font-semibold">
          {label}
        </span>
      </div>

      <p className="mt-3 text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}