"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { AVAILABLE_SEASONS } from "@/lib/config";
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
  league: number;
}

export default function SeasonSelector({
  value,
  league,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  function selectSeason(year: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("league", String(league));
    params.set("season", String(year));

    router.push(`/standings?${params.toString()}`);

    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex h-12 min-w-[180px] items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span>{value}</span>

        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[180px] border-white/10 bg-zinc-900 p-0"
      >
        <Command>
          <CommandInput placeholder="Search season..." />

          <CommandList>
            <CommandEmpty>
              No season found.
            </CommandEmpty>

            <CommandGroup>
              {AVAILABLE_SEASONS.map((year) => (
                <CommandItem
                  key={year}
                  value={String(year)}
                  onSelect={() => selectSeason(year)}
                >
                  <span>{year}</span>

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === year
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