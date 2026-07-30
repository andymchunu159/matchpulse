import ResultsHeader from "@/components/results/ResultsHeader";
import ResultsContent from "@/components/results/ResultsContent";
import DateStrip from "@/components/fixtures/DateStrip";

import { getResults } from "@/lib/football-server";

interface Props {
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function ResultsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const today = new Date();

  const selectedDate =
    params.date ??
    today.toISOString().split("T")[0];

  const matches = await getResults(selectedDate);

  return (
    <main className="container mx-auto space-y-6 py-8">
      <ResultsHeader date={selectedDate} />

      <DateStrip
        selectedDate={selectedDate}
        basePath="/results"
      />

      <ResultsContent
        matches={matches}
        selectedDate={selectedDate}
      />
    </main>
  );
}