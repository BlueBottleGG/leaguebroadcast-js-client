/** Builds `?a=1&b=2` from the entries that are set, or `''` when none are. */
export function query(params: Record<string, unknown>): string {
  const search = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  ).toString();
  return search ? `?${search}` : "";
}
