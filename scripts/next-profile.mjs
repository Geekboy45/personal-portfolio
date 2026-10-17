import { spawn } from "node:child_process";
const [command, profile] = process.argv.slice(2);
if (
  !["dev", "build", "start"].includes(command) ||
  !["server", "static"].includes(profile)
) {
  throw new Error("Expected dev|build|start and server|static.");
}
if (command === "start" && profile === "static")
  throw new Error("Serve out/ with a static host.");
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", command],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      DEPLOYMENT_PROFILE: profile,
      CACHE_MODEL: "traditional",
    },
  },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
