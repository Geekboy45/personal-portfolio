import type { NextConfig } from "next";
import { siteBasePath } from "./src/lib/site-path";

const profile = process.env.DEPLOYMENT_PROFILE;
if (profile !== "server" && profile !== "static") {
  throw new Error(
    "Select DEPLOYMENT_PROFILE=server or static using the named package scripts.",
  );
}
if (process.env.CACHE_MODEL !== "traditional") {
  throw new Error("This starter implements CACHE_MODEL=traditional only.");
}
const config: NextConfig = {
  basePath: siteBasePath,
  output: profile === "static" ? "export" : "standalone",
  cacheComponents: false,
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/master/sprites/pokemon/**",
        search: "",
      },
    ],
  },
};
export default config;
