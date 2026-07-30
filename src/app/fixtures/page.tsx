import FixturesHeader from "@/components/fixtures/FixturesHeader";
import FixturesContent from "@/components/fixtures/FixturesContent";
import { getFixtures } from "@/lib/football-server";
import DateStrip from "@/components/fixtures/DateStrip";

interface Props {
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function FixturesPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const today = new Date();

  const selectedDate =
    params.date ??
    today.toISOString().split("T")[0];

  const fixtures = await getFixtures(selectedDate);

  return (
    <main className="container mx-auto space-y-6 py-8">
      <FixturesHeader date={selectedDate} />

<DateStrip
  selectedDate={selectedDate}
  basePath="/fixtures"
/>

     <FixturesContent fixtures={fixtures} />
    </main>
  );
}