"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import FormBadges from "./FormBadges";
import { TEAM_ID_MAP } from "@/lib/team-id-map";

interface Props {
  team: any;
  leagueId: number;
  season: number;
}

function getQualificationColor(team: any) {
  const text = `${team.description ?? ""} ${team.status ?? ""}`.toLowerCase();

  if (text.includes("champions league")) {
    return "border-l-4 border-green-500";
  }

  if (
    text.includes("europa league") &&
    !text.includes("conference")
  ) {
    return "border-l-4 border-blue-500";
  }

  if (
    text.includes("conference") ||
    text.includes("conference league")
  ) {
    return "border-l-4 border-orange-500";
  }

  if (text.includes("relegation")) {
    return "border-l-4 border-red-500";
  }

  return "border-l-4 border-transparent";
}

export default function TeamRow({
  team,
  leagueId,
  season,
}: Props) {
  const router = useRouter();

  const qualificationColor =
    getQualificationColor(team);

  function handleClick() {
    const apiFootballId =
      TEAM_ID_MAP[team.team.id] ??
      team.team.id;

    router.push(
      `/team/${apiFootballId}?league=${leagueId}&season=${season}`
    );
  }

  return (
    <tr
      onClick={handleClick}
      className="group cursor-pointer border-b border-zinc-800 transition-all duration-200 hover:bg-zinc-800/40 hover:shadow-[inset_0_0_0_1px_rgba(34,197,94,0.25)]"
    >
      {/* Position */}
      <td
        className={`px-4 py-4 text-center ${qualificationColor}`}
      >
        <span className="font-bold text-white">
          {team.rank}
        </span>
      </td>

      {/* Team */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={team.team.logo}
            alt={team.team.name}
            width={28}
            height={28}
          />

          <span className="font-semibold text-white transition-colors group-hover:text-green-400">
            {team.team.name}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-center text-white">
        {team.all.played}
      </td>

      <td className="px-4 py-4 text-center text-white">
        {team.all.win}
      </td>

      <td className="px-4 py-4 text-center text-white">
        {team.all.draw}
      </td>

      <td className="px-4 py-4 text-center text-white">
        {team.all.lose}
      </td>

      <td className="px-4 py-4 text-center text-white">
        {team.all.goals.for}
      </td>

      <td className="px-4 py-4 text-center text-white">
        {team.all.goals.against}
      </td>

      <td className="px-4 py-4 text-center">
        <span
          className={`font-bold ${
            team.goalsDiff >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {team.goalsDiff > 0
            ? `+${team.goalsDiff}`
            : team.goalsDiff}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="rounded-lg bg-green-600 px-3 py-1 font-bold text-white">
          {team.points}
        </span>
      </td>

      <td className="px-4 py-4">
        <FormBadges form={team.form} />
      </td>
    </tr>
  );
}