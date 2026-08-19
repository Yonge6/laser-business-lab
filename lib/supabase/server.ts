type InsertOptions = {
  onConflict?: string;
  resolution?: "merge-duplicates" | "ignore-duplicates";
};

export const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function insertRows(table: string, rows: Record<string, unknown> | Record<string, unknown>[], options: InsertOptions = {}) {
  if (!hasSupabase) return { persisted: false as const, reason: "not_configured" as const };
  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const url = new URL(`${base}/rest/v1/${table}`);
  if (options.onConflict) url.searchParams.set("on_conflict", options.onConflict);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      "content-type": "application/json",
      prefer: options.resolution ? `resolution=${options.resolution},return=minimal` : "return=minimal",
    },
    body: JSON.stringify(rows),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Supabase insert failed for ${table}: ${response.status}`);
  return { persisted: true as const };
}
