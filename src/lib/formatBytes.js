export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "K", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = (bytes / Math.pow(1024, i)).toFixed(1);
  return `${value} ${units[i]}`;
}
