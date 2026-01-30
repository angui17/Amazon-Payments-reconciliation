export const formatDescription = (text, max = 50) => {
  if (!text) return "-";

  const t = text.toLowerCase();
  const truncated = t.length > max ? t.slice(0, max) + "..." : t;

  return truncated.charAt(0).toUpperCase() + truncated.slice(1);
};
