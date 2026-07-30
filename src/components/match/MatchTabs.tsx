"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
}

export default function MatchTabs({
  tabs,
  defaultTab,
}: Props) {
  const [activeTab, setActiveTab] = useState(
    defaultTab ?? tabs[0]?.id
  );

  const activeContent = tabs.find(
    (tab) => tab.id === activeTab
  )?.content;

  return (
    <section className="space-y-6">
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>{activeContent}</div>
    </section>
  );
}