export function getQualificationColor(
  description?: string
) {
  if (!description) return "";

  const value = description.toLowerCase();

  if (value.includes("champions league")) {
    return "border-l-4 border-green-500";
  }

  if (value.includes("europa league")) {
    return "border-l-4 border-blue-500";
  }

  if (
    value.includes("conference") ||
    value.includes("conference league")
  ) {
    return "border-l-4 border-orange-500";
  }

  if (value.includes("relegation")) {
    return "border-l-4 border-red-500";
  }

  return "";
}