import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const build = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://maker.wonderelian.com",
  },
});

build.once("error", (error) => {
  console.error("Unable to start the Pages build:", error.message);
  process.exitCode = 1;
});

build.once("exit", (code, signal) => {
  if (signal) {
    console.error(`Pages build terminated by ${signal}`);
  }
  process.exitCode = code ?? 1;
});
