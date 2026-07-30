interface Props {
  venue: any;
}

export default function VenueTab({
  venue,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Venue
      </h2>

      <pre className="overflow-auto text-sm text-zinc-400">
        {JSON.stringify(venue, null, 2)}
      </pre>
    </div>
  );
}