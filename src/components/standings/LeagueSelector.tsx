"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { LEAGUES } from "@/lib/leagues";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  value: number;
  season: number;
}

export default function LeagueSelector({
  value,
  season,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    LEAGUES.find((league) => league.id === value) ??
    LEAGUES[0];

  function selectLeague(id: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("league", String(id));
    params.set("season", String(season));

    router.push(`/standings?${params.toString()}`);

    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex h-12 w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Image
            src={selected.logo}
            alt={selected.name}
            width={24}
            height={24}
            className="h-auto w-auto"
          />

          <span className="truncate">
            {selected.name}
          </span>
        </div>

        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[340px] border-white/10 bg-zinc-900 p-0"
      >
        <Command>
          <CommandInput placeholder="Search league..." />

          <CommandList>
            <CommandEmpty>
              No league found.
            </CommandEmpty>

            <CommandGroup>
              {LEAGUES.map((league) => (
                <CommandItem
                  key={league.id}
                  value={`${league.name} ${league.country}`}
                  onSelect={() => selectLeague(league.id)}
                >
                  <Image
                    src={league.logo}
                    alt={league.name}
                    width={24}
                    height={24}
                    className="mr-3 h-auto w-auto"
                  />

                  <div className="flex flex-1 flex-col">
                    <span>{league.name}</span>

                    <span className="text-xs text-zinc-400">
                      {league.country}
                    </span>
                  </div>

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === league.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}