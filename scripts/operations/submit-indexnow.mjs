import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";
const endpoint = process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow";
const key = "cde512295afdc1664f12d45ffe7268b9";
const keyLocation = `${siteUrl}/${key}.txt`;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function normalizeSiteUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("IndexNow site URL must use HTTPS.");
  return url;
}

function uniqueSiteUrls(values, site) {
  return [...new Set(values.map((value) => new URL(value, site).toString()))]
    .filter((value) => new URL(value).host === site.host)
    .slice(0, 10_000);
}

async function seedUrls(site) {
  const response = await fetch(new URL("/sitemap.xml", site), { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Unable to read sitemap: HTTP ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function changedUrls(site) {
  const raw = await readFile(path.join(root, "content/operations/state.json"), "utf8");
  const state = JSON.parse(raw);
  return [
    new URL("/", site).toString(),
    new URL("/radar/", site).toString(),
    new URL(`/radar/${state.lastRunDate}/`, site).toString(),
  ];
}

async function verifyKeyFile() {
  const response = await fetch(keyLocation, { signal: AbortSignal.timeout(15_000) });
  const body = response.ok ? (await response.text()).trim() : "";
  if (!response.ok || body !== key) throw new Error(`IndexNow key file is not live at ${keyLocation}.`);
}

async function main() {
  const site = normalizeSiteUrl(siteUrl);
  const urls = process.env.INDEXNOW_SEED_ALL === "true" ? await seedUrls(site) : await changedUrls(site);
  const urlList = uniqueSiteUrls(urls, site);
  if (urlList.length === 0) throw new Error("No same-host URLs were selected for IndexNow.");

  if (process.env.INDEXNOW_DRY_RUN === "true") {
    console.log(JSON.stringify({ mode: "dry-run", host: site.host, urlCount: urlList.length, urlList }, null, 2));
    return;
  }

  await verifyKeyFile();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: site.host, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(20_000),
  });
  if (![200, 202].includes(response.status)) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`IndexNow submission failed: HTTP ${response.status}${detail ? ` — ${detail}` : ""}`);
  }
  console.log(`IndexNow accepted ${urlList.length} changed URLs with HTTP ${response.status}.`);
}

await main();
