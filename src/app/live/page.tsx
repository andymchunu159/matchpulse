"use client";

import { useEffect, useState } from "react";

import LiveHeader from "@/components/live/LiveHeader";
import LeagueSection from "@/components/live/LeagueSection";
import LiveFilters from "@/components/live/LiveFilters";
import LoadingSkeleton from "@/components/live/LoadingSkeleton";

import { groupMatchesByLeague } from "@/lib/groupMatches";

export default function LivePage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const loadMatches = async () => {
    try {
      const response = await fetch("/api/football/live");

      const data = await response.json();

      setMatches(data.response ?? []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load live matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();

    const interval = setInterval(loadMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-6 text-white">
        <div className="space-y-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  const filteredMatches = matches.filter((match) => {
    if (selectedFilter === "All") return true;

    const status = match.fixture.status.short;

    switch (selectedFilter) {
      case "Live":
        return [
          "1H",
          "2H",
          "ET",
          "BT",
          "P",
        ].includes(status);

      case "1H":
        return status === "1H";

      case "HT":
        return status === "HT";

      case "2H":
        return status === "2H";

      case "ET":
        return ["ET", "BT", "P"].includes(status);

      case "FT":
        return status === "FT";

      default:
        return true;
    }
  });

  const grouped =
    groupMatchesByLeague(filteredMatches);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <LiveHeader
        totalMatches={filteredMatches.length}
        lastUpdated={lastUpdated}
      />

      <LiveFilters
        selected={selectedFilter}
        onChange={setSelectedFilter}
      />

      {filteredMatches.length === 0 ? (
        <p className="text-zinc-400">
          There are currently no matches for this filter.
        </p>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <LeagueSection
              key={group.league.id}
              leagueName={group.league.name}
              leagueLogo={group.league.logo}
              country={group.league.country}
              matches={group.matches}
            />
          ))}
        </div>
      )}
    </main>
  );
}