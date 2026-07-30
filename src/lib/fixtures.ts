export async function getFixture(id: string) {
  const res = await fetch(`/api/football/fixture/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load fixture.");
  }

  const data = await res.json();

  return data.response?.[0];
}