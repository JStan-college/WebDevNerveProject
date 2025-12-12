export function formatDateCompact(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} • ${time}`;
}

export function timeAgoOrDate(iso) {
  if (!iso) return '';
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d ago`;

  return formatDateCompact(iso);
}

const dateUtils = { formatDateCompact, timeAgoOrDate };

export default dateUtils;
