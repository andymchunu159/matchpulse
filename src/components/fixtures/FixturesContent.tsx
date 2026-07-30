"use client";

import { useMemo, useState } from "react";
import FixtureCard from "./FixtureCard";
import FixtureFilters, {
  FixtureFilter,
} from "./FixtureFilters";
import EmptyFixtures from "./EmptyFixtures";
import { filterFixtures } from "@/lib/filterFixtures";
import { groupFixtures } from "@/lib/groupFixtures";
import { Fixture } from "@/lib/football";

interface Props {
  fixtures: Fixture[];
}

export default function FixturesContent({
  fixtures,
}: Props) {
  const [filter, setFilter] =
    useState<FixtureFilter>("all");

  const filtered = useMemo(
    () => filterFixtures(fixtures, filter),
    [fixtures, filter]
  );

  const groups = Object.values(
    groupFixtures(filtered)
  );

  return (
    <div className="space-y-6">
      <FixtureFilters
        value={filter}
        onChange={setFilter}
      />

      {groups.length === 0 ? (
        <EmptyFixtures />
      ) : (
        groups.map((group) => (
          <section
            key={group.league.id}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 rounded-lg bg-zinc-900 p-3">
              <img
                src={group.league.logo}
                alt={group.league.name}
                className="h-7 w-7"
              />

              <div>
                <h2 className="font-semibold">
                  {group.league.name}
                </h2>

                <p className="text-sm text-zinc-400">
                  {group.league.country}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {group.fixtures.map((fixture) => (
                <FixtureCard
                  key={fixture.fixture.id}
                  fixture={fixture}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}