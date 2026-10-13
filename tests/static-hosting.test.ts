import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const nginxConfig = readFileSync(new URL("../deploy/nginx/maker-static-export.conf", import.meta.url), "utf8");
const effectiveConfig = nginxConfig.replace(/#.*$/gm, "");
const nginxBinary = process.env.NGINX_BINARY;

describe("static export hosting contract", () => {
  it("requires every file lookup to end in a real 404 rather than a homepage fallback", () => {
    const lookups = [...effectiveConfig.matchAll(/try_files\s+([^;]+);/g)].map((match) => match[1].trim().split(/\s+/));
    expect(lookups.length).toBeGreaterThan(0);
    for (const candidates of lookups) {
      expect(candidates.at(-1)).toBe("=404");
      expect(candidates).not.toContain("/index.html");
      expect(candidates).not.toContain("$uri/");
      expect(candidates.every((candidate) => candidate.startsWith("$uri") || candidate === "=404")).toBe(true);
    }
    expect(effectiveConfig).toMatch(/location\s+\^~\s+\/_next\/static\/\s*\{\s*try_files\s+\$uri\s+=404;/);
    expect(effectiveConfig).toMatch(/location\s+\/\s*\{\s*try_files\s+\$uri\s+\$uri\/index\.html\s+=404;/);
  });

  it("keeps the exported not-found response internal without rewriting its status to 200", () => {
    expect(effectiveConfig).toMatch(/error_page\s+404\s+\/404\.html;/);
    expect(effectiveConfig).not.toMatch(/error_page\s+404\s+=/);
    expect(effectiveConfig).toMatch(/location\s+=\s+\/404\.html\s*\{\s*internal;/);
    expect(effectiveConfig).not.toMatch(/\b(rewrite|proxy_pass|root|listen|server_name)\b/);
  });
});

// A native Nginx executable is opt-in; contract tests above need no system service.
describe.skipIf(!nginxBinary)("loopback Nginx static export integration", () => {
  let fixtureDir: string;
  let nginx: ChildProcess;
  let origin: string;
  const homepage = "<!doctype html><h1>Maker home fixture</h1>";
  const notFound = '<!doctype html><meta name="robots" content="noindex"><h1>Quest not found.</h1>';

  beforeAll(async () => {
    fixtureDir = mkdtempSync(join(tmpdir(), "maker-static-hosting-"));
    mkdirSync(join(fixtureDir, "logs"));
    mkdirSync(join(fixtureDir, "temp"));
    const webRoot = join(fixtureDir, "out");
    const files = {
      "index.html": homepage,
      "404.html": notFound,
      "calculator/laser-roi/index.html": "<!doctype html><h1>Maker ROI fixture</h1>",
      "learn/etsy-tumbler-pricing-us/index.html": "<!doctype html><h1>Tumbler pricing fixture</h1>",
      "_next/static/chunks/app.js": "window.makerFixture = true;",
      "operations/latest.json": '{"generatedFor":"2026-10-13"}',
    };
    for (const [path, body] of Object.entries(files)) {
      const file = join(webRoot, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, body);
    }
    mkdirSync(join(webRoot, "empty-directory"));
    writeFileSync(join(fixtureDir, "maker-static-export.conf"), nginxConfig);

    const port = await new Promise<number>((resolve, reject) => {
      const reservation = createServer();
      reservation.once("error", reject);
      reservation.listen(0, "127.0.0.1", () => {
        const address = reservation.address();
        if (!address || typeof address === "string") return reject(new Error("No loopback port"));
        reservation.close((error) => error ? reject(error) : resolve(address.port));
      });
    });
    origin = `http://127.0.0.1:${port}`;
    const prefix = fixtureDir.replaceAll("\\", "/");
    const localConfig = `
daemon off;
master_process off;
pid "${prefix}/nginx.pid";
error_log "${prefix}/error.log";
events { worker_connections 32; }
http {
    access_log off;
    types { text/html html; application/javascript js; application/json json; }
    server {
        listen 127.0.0.1:${port};
        server_name localhost;
        root "${prefix}/out";
        include "${prefix}/maker-static-export.conf";
    }
}
`;
    writeFileSync(join(fixtureDir, "nginx.conf"), localConfig);
    const args = ["-p", `${prefix}/`, "-c", "nginx.conf"];
    const syntax = spawnSync(nginxBinary!, [...args, "-t"], { encoding: "utf8", windowsHide: true });
    expect(syntax.status, syntax.stderr || syntax.error?.message).toBe(0);
    nginx = spawn(nginxBinary!, args, { windowsHide: true, stdio: "ignore" });
    for (let attempt = 0; attempt < 50; attempt++) {
      try {
        if ((await fetch(origin)).ok) return;
      } catch {
        if (nginx.exitCode !== null) throw new Error("Fixture Nginx exited before serving requests");
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error("Fixture Nginx did not start within five seconds");
  }, 10000);

  afterAll(async () => {
    if (nginx && nginx.exitCode === null) {
      await new Promise<void>((resolve) => {
        nginx.once("exit", () => resolve());
        nginx.kill();
      });
    }
    if (fixtureDir) rmSync(fixtureDir, { recursive: true, force: true });
  });

  it.each([
    ["/", "Maker home fixture"],
    ["/calculator/laser-roi/", "Maker ROI fixture"],
    ["/calculator/laser-roi?utm_source=pinterest", "Maker ROI fixture"],
    ["/learn/etsy-tumbler-pricing-us/", "Tumbler pricing fixture"],
    ["/_next/static/chunks/app.js", "window.makerFixture"],
    ["/operations/latest.json", '"generatedFor"'],
  ])("serves an existing exported file at %s", async (path, marker) => {
    const response = await fetch(`${origin}${path}`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain(marker);
  });

  it.each([
    "/hosting-check-missing/",
    "/learn/not-exported/?utm_source=pinterest",
    "/_next/static/chunks/missing.js",
    "/operations/missing.json",
    "/empty-directory/",
    "/404.html",
  ])("returns the not-found document with status 404 at %s", async (path) => {
    const response = await fetch(`${origin}${path}`);
    expect(response.status).toBe(404);
    const body = await response.text();
    expect(body).toBe(notFound);
    expect(body).not.toBe(homepage);
  });
});
