import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, cp } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const profile = process.argv[2];
assert(["server", "static"].includes(profile), "Pass server or static");
const root = resolve("out");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};
const host = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = resolve(
      root,
      "." + pathname,
      pathname.endsWith("/") ? "index.html" : "",
    );
    if (!file.startsWith(root + sep)) throw new Error("Invalid path");
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(await readFile(resolve(root, "404.html")).catch(() => "Not found"));
  }
});
await new Promise((done) => host.listen(0, "127.0.0.1", done));
const port = host.address().port;
let child;
let output = "";
try {
  if (profile === "server") {
    await new Promise((done) => host.close(done));
    await cp("public", ".next/standalone/public", { recursive: true });
    await cp(".next/static", ".next/standalone/.next/static", {
      recursive: true,
    });
    child = spawn(process.execPath, [".next/standalone/server.js"], {
      env: { ...process.env, PORT: String(port), HOSTNAME: "127.0.0.1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (data) => {
      output = (output + data).slice(-8000);
    });
    child.stderr.on("data", (data) => {
      output = (output + data).slice(-8000);
    });
  }
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      ready = (await fetch(base, { signal: AbortSignal.timeout(1000) })).ok;
    } catch {}
    if (ready) break;
    if (child?.exitCode !== null && child) throw new Error(output);
    await sleep(250);
  }
  assert(ready, "Production server did not become ready: " + output);
  for (const path of ["/", "/explore/", "/explore/?page=2"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<h1/);
    assert.match(html, /noindex/);
    const assets = [
      ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g),
    ].map((match) => match[1]);
    assert(assets.length > 0, "Missing generated assets");
    for (const asset of new Set(assets)) {
      const result = await fetch(new URL(asset.replaceAll("&amp;", "&"), base));
      assert.equal(result.status, 200, asset);
      assert.match(result.headers.get("Content-Type") ?? "", /javascript|css/);
    }
  }
  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const body = await response.text();
    assert(
      !body.includes("pokedex.silph.lab"),
      "Placeholder origin in metadata",
    );
    if (path === "/sitemap.xml")
      assert(
        !body.includes("<loc>"),
        "Noindex artifact must not advertise indexable URLs",
      );
  }
  assert.equal((await fetch(base + "/not-a-real-route/")).status, 404);
  console.log(
    `${profile}: production routes, nested refresh, noindex, assets and 404 passed.`,
  );
} finally {
  if (child && child.exitCode === null) {
    const closed = new Promise((done) => child.once("exit", done));
    child.kill("SIGTERM");
    await Promise.race([
      closed,
      sleep(5000).then(() => {
        if (child.exitCode === null) child.kill("SIGKILL");
      }),
    ]);
  }
  if (host.listening) await new Promise((done) => host.close(done));
}
