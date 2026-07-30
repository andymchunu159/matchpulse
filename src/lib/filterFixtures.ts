import { Fixture } from "./football";
import { FixtureFilter } from "@/components/fixtures/FixtureFilters";

export function filterFixtures(
  fixtures: Fixture[],
  filter: FixtureFilter
) {
  switch (filter) {
    case "live":
      return fixtures.filter((fixture) =>
        ["1H", "2H", "HT", "ET", "BT", "P"].includes(
          fixture.fixture.status.short
        )
      );

    case "finished":
      return fixtures.filter((fixture) =>
        ["FT", "AET", "PEN"].includes(
          fixture.fixture.status.short
        )
      );

    case "upcoming":
      return fixtures.filter((fixture) =>
        ["NS", "TBD"].includes(
          fixture.fixture.status.short
        )
      );

    default:
      return fixtures;
  }
}