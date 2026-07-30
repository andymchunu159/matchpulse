interface Props {
  form?: string;
}

export default function FormBadges({
  form,
}: Props) {
  if (!form) {
    return (
      <span className="text-zinc-500">
        —
      </span>
    );
  }

  return (
    <div className="flex justify-center gap-1">

      {form.split("").map((result, index) => {
        const styles =
          result === "W"
            ? "bg-green-600"
            : result === "D"
            ? "bg-yellow-500"
            : "bg-red-600";

        return (
          <span
            key={index}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${styles}`}
          >
            {result}
          </span>
        );
      })}

    </div>
  );
}