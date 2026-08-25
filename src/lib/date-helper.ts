const formatTime = (minutes: number, hours: number, diff: number) => {
  if (minutes < 1) return "Just Now";
  else if (minutes < 60) return `${minutes}m ago`;
  else if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(diff / 24)}d ago `;
};
export const formatTimeAgo = (created_at: string) => {
  const now = new Date();
  const created = new Date(created_at);
  const diff = now.getTime() - created.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return formatTime(minutes, hours, diff);
};

export const formatTimeRemaining = (expires_at: string) => {
  const now = new Date();
  const expiresAt = new Date(expires_at);
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) return "Expired";
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};
