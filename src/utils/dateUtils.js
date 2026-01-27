export const isCurrentMonth = (dateStr) => {
  console.log(dateStr)
  if (!dateStr) return false;

  // Espera formato MM-DD-YYYY
  const [month, day, year] = dateStr.split("-").map(Number);

  if (!month || !day || !year) return false;

  const date = new Date(year, month - 1, day);
  const now = new Date();

  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};
