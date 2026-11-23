import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createOpenBotLogger } from "@openbot/logging";
import { BRAND_ASSETS } from "../apps/auth-api/src/lib/brand-assets";
import { CONTENT_COLLECTIONS } from "../apps/auth-api/src/lib/content";
import { SITE_PLUGINS } from "../apps/auth-api/src/lib/plugins";
import { LOCALIZED_PAGE_PATHS } from "../apps/auth-api/src/lib/site-paths";

const logger = createOpenBotLogger("build-vercel");
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const authApiDir = join(rootDir, "apps", "auth-api");
const distClientDir = join(authApiDir, "dist", "client");
const outDir = join(rootDir, "vercel-dist");

const STATIC_ROUTES = [
  "/",
  "/app",
  "/app-preview",
  "/download",
  "/download/macos",
  "/download/windows",
  "/download/linux",
  "/download/ios",
  "/download/android",
  "/brand",
  "/marketplace",
  "/marketplace/skills",
  "/marketplace/apps",
  ...SITE_PLUGINS.map((plugin) => `/plugins/${plugin.slug}`),
  "/teams",
  "/pricing",
  "/news",
  "/guides",
  "/compare",
  "/providers",
  "/changelog",
  "/contact",
  "/terms",
  "/privacy-policy",
  "/commercial-license",
  "/dpa",
  "/cla",
  ...Object.values(LOCALIZED_PAGE_PATHS).flatMap((paths) => Object.values(paths)),
  ...CONTENT_COLLECTIONS.flatMap((collection) =>
    collection.articles.map((article) => `/${collection.id}/${article.slug}`),
  ),
];

async function runCommand(cmd: string, args: string[], cwd: string): Promise<void> {
  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=6144", VITE_CAT_STATIC_SITE: "true" },
    });
    child.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Preview server did not start within ${timeoutMs}ms`);
}

async function main() {
  const localD1Dir = join(authApiDir, ".wrangler", "state", "v3", "d1");
  if (!existsSync(localD1Dir)) {
    logger.info("Initializing local D1 database and Cat marketplace catalog.");
    await runCommand("bun", ["run", "api:migrate:local"], rootDir);
    await runCommand("bun", ["run", "marketplace:seed:local"], rootDir);
  }

  if (!existsSync(distClientDir)) {
    logger.info("Building apps/auth-api production bundle.");
    await runCommand("bun", ["run", "build"], authApiDir);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(distClientDir, outDir, { recursive: true });

  // Remove Cloudflare-only _headers / .assetsignore if present
  rmSync(join(outDir, ".assetsignore"), { force: true });
  rmSync(join(outDir, "_headers"), { force: true });
  cpSync(join(rootDir, "vercel.json"), join(outDir, "vercel.json"));

  // Write all /brand/*.svg assets
  const brandDir = join(outDir, "brand");
  mkdirSync(brandDir, { recursive: true });
  for (const asset of BRAND_ASSETS) {
    writeFileSync(join(brandDir, `${asset.file}.svg`), asset.svg, "utf8");
  }

  // Start vite preview to pre-render all HTML pages with production asset references
  const previewPort = 3109;
  const previewOrigin = `http://127.0.0.1:${previewPort}`;
  const previewProc = spawn(
    process.execPath,
    ["x", "vite", "preview", "--port", String(previewPort), "--host", "127.0.0.1"],
    {
      cwd: authApiDir,
      stdio: "inherit",
    },
  );

  try {
    await waitForServer(`${previewOrigin}/`);
    for (const route of STATIC_ROUTES) {
      const res = await fetch(`${previewOrigin}${route}`);
      if (!res.ok) {
        logger.warn(`Route ${route} returned ${res.status}`);
        continue;
      }
      const html = await res.text();
      const targetFile = route === "/" ? join(outDir, "index.html") : join(outDir, route.slice(1), "index.html");
      mkdirSync(dirname(targetFile), { recursive: true });
      writeFileSync(targetFile, html, "utf8");
    }
  } finally {
    previewProc.kill();
  }

  logger.info(`Vercel static site written to ${outDir}`);
}

await main();
