import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /**
   * Next blocks cross-origin requests to dev-only assets (`/_next/hmr`,
   * `/_next/static/chunks/...`) by default. In this setup the app listens on
   * :3000 and is reached through a proxy on :8080, so those requests arrive
   * from a different origin and were being rejected — which shows up as
   * "Blocked cross-origin request to Next.js dev resource" and breaks hot
   * reload. Allowing the loopback origins the proxy uses fixes it.
   *
   * Development only; it has no effect on a production build.
   */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
