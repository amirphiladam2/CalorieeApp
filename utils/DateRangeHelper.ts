type Range = { start: string; end: string };

export const getRangeForFilter = (
  filter: "Today" | "Week" | "Month",
  referenceDate: string
): Range => {
  const [y, m, d] = referenceDate.split("-").map(Number);
  const ref = new Date(y, m - 1, d); // LOCAL, safe

  if (filter === "Today") {
    return { start: referenceDate, end: referenceDate };
  }

  if (filter === "Week") {
    const day = ref.getDay(); // Sun=0, Mon=1
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(ref);
    monday.setDate(ref.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: toDateString(monday),
      end: toDateString(sunday),
    };
  }

  // Month
  const firstDay = new Date(y, m - 1, 1);
  const lastDay = new Date(y, m, 0);

  return {
    start: toDateString(firstDay),
    end: toDateString(lastDay),
  };
};
const toDateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
export const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
