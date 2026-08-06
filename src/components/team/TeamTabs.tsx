"use client";

import { useState } from "react";

import OverviewTab from "./OverviewTab";
import FixturesTab from "./FixturesTab";
import ResultsTab from "./ResultsTab";
import SquadTab from "./SquadTab";

import { Fixture } from "@/lib/football";

interface Props {
  team: any;
  statistics: any;
  squad: any;
  upcomingFixtures?: Fixture[];
  recentResults?: Fixture[];
}

const tabs = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "fixtures",
    label: "Fixtures",
  },
  {
    id: "results",
    label: "Results",
  },
  {
    id: "squad",
    label: "Squad",
  },
];

export default function TeamTabs({
  team,
  statistics,
  squad,
  upcomingFixtures = [],
  recentResults = [],
}: Props) {
  const [activeTab, setActiveTab] =
    useState("overview");

  return (
    <section className="space-y-6">
      {/* Tabs */}

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id)
            }
            className={`rounded-xl px-5 py-3 font-semibold transition ${
              activeTab === tab.id
                ? "bg-green-600 text-white"
                : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-green-500 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}

      {activeTab === "overview" && (
        <OverviewTab
          team={team}
          statistics={statistics}
        />
      )}

      {activeTab === "fixtures" && (
        <FixturesTab
          fixtures={upcomingFixtures}
        />
      )}

      {activeTab === "results" && (
        <ResultsTab
          fixtures={recentResults}
        />
      )}

      {activeTab === "squad" &&
        (squad ? (
          <SquadTab squad={squad} />
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-10 text-center">
            <h2 className="text-2xl font-bold text-white">
              Squad Unavailable
            </h2>

            <p className="mt-3 text-zinc-400">
              Squad information is not
              available for this team.
            </p>
          </div>
        ))}
    </section>
  );
}