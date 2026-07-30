"use client";

import { useState } from "react";

import OverviewTab from "./OverviewTab";
import FixturesTab from "./FixturesTab";
import ResultsTab from "./ResultsTab";
import SquadTab from "./SquadTab";
import VenueTab from "./VenueTab";

interface Props {
  team: any;
  statistics: any;
  squad: any;
  fixtures: any[];
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
  {
    id: "venue",
    label: "Venue",
  },
];

export default function TeamTabs({
  team,
  statistics,
  squad,
  fixtures,
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
        <FixturesTab fixtures={fixtures} />
      )}

      {activeTab === "results" && (
        <ResultsTab fixtures={fixtures} />
      )}

      {activeTab === "squad" && (
        <SquadTab squad={squad} />
      )}

      {activeTab === "venue" && (
        <VenueTab venue={team.venue} />
      )}
    </section>
  );
}