import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, cp } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const profile = process.argv[2];
assert(["server", "static"].includes(profile), "Pass server or static");
const root = resolve("out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const indexable = process.env.ALLOW_INDEXING === "true";
const mime = {
  ".pdf": "application/pdf",
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};
const host = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (basePath) {
      if (pathname !== basePath && !pathname.startsWith(basePath + "/"))
        throw new Error("Outside site prefix");
      pathname = pathname.slice(basePath.length) || "/";
    }
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
  const base = `http://127.0.0.1:${port}${basePath}`;
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      ready = (await fetch(base + "/", { signal: AbortSignal.timeout(1000) }))
        .ok;
    } catch {}
    if (ready) break;
    if (child?.exitCode !== null && child) throw new Error(output);
    await sleep(250);
  }
  assert(ready, "Production server did not become ready: " + output);
  const cv = await fetch(base + "/files/luis-elizondo-cv.pdf");
  assert.equal(cv.status, 200, "CV download must be available");
  assert.match(cv.headers.get("Content-Type") ?? "", /application\/pdf/);
  assert.equal(
    Buffer.from(await cv.arrayBuffer())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
  for (const path of ["/", "/es/"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<h1/);
    if (indexable) assert.doesNotMatch(html, /noindex/);
    else assert.match(html, /noindex/);
    assert.match(
      html,
      new RegExp(`<html[^>]*lang="${path === "/es/" ? "es" : "en"}"`),
    );
    if (path === "/" || path === "/es/") {
      const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
      assert.match(
        main,
        path === "/es/"
          ? /Primero, entender la pregunta/
          : /First, understand the question/,
      );
      assert.equal(
        (
          main.match(
            path === "/es/" ? /Fotografía pendiente/g : /Photo to be added/g,
          ) ?? []
        ).length,
        0,
      );
      assert.match(main, /luis-graduation\.jpeg/);
      assert.match(main, /luis-academic-excellence\.jpeg/);
      assert.match(main, /luis-conferencia-selit\.jpeg/);
      assert.match(
        main,
        path === "/es/"
          ? /Gestor \| Validador Documental/
          : /Document Manager \| Validator/,
      );
      assert.match(main, /GILSA/);
      assert.match(main, /Datómicos/);
      assert.match(main, /Aeris/);
      assert.doesNotMatch(main, /Crédito Central/);
      assert.match(
        main,
        path === "/es/" ? /renovación de crédito/ : /Loan renewal/,
      );
      assert.doesNotMatch(main, /Inspect Architecture|images\/projects\//i);
    }
    const assets = [
      ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g),
    ].map((match) => match[1]);
    assert(assets.length > 0, "Missing generated assets");
    const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(
      (match) => match[1],
    );
    for (const asset of new Set(images)) {
      assert(
        asset.startsWith(basePath + "/"),
        "Image must retain the site prefix: " + asset,
      );
      const result = await fetch(
        new URL(asset.replaceAll("&amp;", "&"), base + "/"),
      );
      assert.equal(result.status, 200, asset);
      assert.match(result.headers.get("Content-Type") ?? "", /^image\//);
    }
    if (basePath) {
      for (const match of html.matchAll(/href="(\/[^\"]*)"/g)) {
        assert(
          match[1].startsWith(basePath + "/"),
          "Link escaped the site prefix: " + match[1],
        );
      }
    }
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
    if (path === "/sitemap.xml" && !indexable)
      assert(
        !body.includes("<loc>"),
        "Noindex artifact must not advertise indexable URLs",
      );
    if (path === "/sitemap.xml" && indexable) {
      assert(
        body.includes(`${process.env.NEXT_PUBLIC_SITE_ORIGIN}${basePath}/es/`),
        "Missing localized production sitemap URL",
      );
    }
  }
  assert.equal((await fetch(base + "/not-a-real-route/")).status, 404);
  assert.equal((await fetch(base + "/explore/")).status, 404);
  assert.equal((await fetch(base + "/es/not-a-real-route/")).status, 404);
  assert.equal(
    (await fetch(base + "/images/projects/aeris-dashboard.svg")).status,
    404,
  );
  console.log(
    `${profile}: bilingual content, public assets, nested refresh, indexing policy and 404 passed (prefix: ${basePath || "/"}).`,
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
