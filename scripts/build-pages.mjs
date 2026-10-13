import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: "https://maker.wonderelian.com" },
});

if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
